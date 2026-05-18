#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

let passed = 0
let failed = 0

function readText(filePath: string) {
  const raw = readFileSync(filePath)
  return raw[0] === 0xff && raw[1] === 0xfe
    ? raw.toString('utf16le')
    : raw.toString('utf8')
}

function run(desc: string, cmd: string, checkFn?: (out: string) => boolean) {
  try {
    const out = execSync(cmd, { cwd: root, encoding: 'utf8', stdio: 'pipe', shell: process.platform === 'win32' ? true : undefined })
    if (checkFn && !checkFn(out)) {
      console.log(`✗ ${desc} (check failed)`)
      failed += 1
    } else {
      console.log(`✓ ${desc}`)
      passed += 1
    }
  } catch (error: any) {
    console.log(`✗ ${desc}: ${(error.stderr || error.message).trim().split('\n').slice(0, 3).join('; ')}`)
    failed += 1
  }
}

function checkFile(desc: string, filePath: string, checkFn: (content: string) => boolean) {
  try {
    const content = readText(filePath)
    if (checkFn(content)) {
      console.log(`✓ ${desc}`)
      passed += 1
    } else {
      console.log(`✗ ${desc} (content check failed)`)
      failed += 1
    }
  } catch {
    console.log(`✗ ${desc} (file not found)`)
    failed += 1
  }
}

console.log('\n=== Preflight Check ===\n')

run('npm run build compiles', 'npm run build 2>&1', out => !out.toLowerCase().includes('error'))
run('npm run self-test passes', 'npm run self-test 2>&1', out => out.includes('FAIL: 0'))

checkFile('vite base is /prompt-market/', resolve(root, 'vite.config.ts'), content => content.includes("'/prompt-market/'"))
checkFile('README is not Vite default', resolve(root, 'README.md'), content => !content.includes('React + TypeScript + Vite'))

const deployPath = resolve(root, '.github/workflows/deploy.yml')
if (existsSync(deployPath)) {
  checkFile('deploy.yml has pages: write', deployPath, content => /pages:\s*write/.test(content))
  checkFile('deploy.yml has id-token: write', deployPath, content => /id-token:\s*write/.test(content))
} else {
  console.log('⚠ .github/workflows/deploy.yml not found (optional, deploy not configured)')
}

try {
  const tokenInfo = execSync('gh auth status 2>&1', { encoding: 'utf8', shell: process.platform === 'win32' ? true : undefined })
  if (tokenInfo.includes('workflow')) {
    console.log('✓ gh token has workflow scope')
  } else {
    console.log('⚠ gh token missing workflow scope - CI/CD workflow updates may fail on push')
  }
} catch {
  console.log('⚠ could not check gh token scopes')
}

console.log('\n=== Summary ===')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}\n`)

process.exit(failed > 0 ? 1 : 0)
