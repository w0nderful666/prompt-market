#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

let passed = 0
let failed = 0

function run(desc: string, cmd: string, checkFn?: (out: string) => boolean) {
  try {
    const out = execSync(cmd, { cwd: root, encoding: 'utf8', stdio: 'pipe', shell: process.platform === 'win32' ? true : undefined })
    if (checkFn && !checkFn(out)) {
      console.log('✗ ' + desc + ' (check failed)')
      failed++
    } else {
      console.log('✓ ' + desc)
      passed++
    }
  } catch (e: any) {
    console.log('✗ ' + desc + ': ' + (e.stderr || e.message).trim().split('\n').slice(0, 3).join('; '))
    failed++
  }
}

function checkFile(desc: string, filePath: string, checkFn: (content: string) => boolean) {
  try {
    const content = readFileSync(filePath, 'utf8')
    if (checkFn(content)) {
      console.log('✓ ' + desc)
      passed++
    } else {
      console.log('✗ ' + desc + ' (content check failed)')
      failed++
    }
  } catch {
    console.log('✗ ' + desc + ' (file not found)')
    failed++
  }
}

console.log('')
console.log('=== Preflight Check ===')
console.log('')

run('npm run build compiles', 'npm run build 2>&1', out => !out.includes('error'))
run('npm run self-test passes', 'npm run self-test 2>&1', out => out.includes('FAIL: 0'))

checkFile('vite base is /prompt-market-react/', resolve(root, 'vite.config.ts'), out => {
  return out.includes("'/prompt-market-react/'")
})

checkFile('README is not Vite default', resolve(root, 'README.md'), out => {
  return !out.includes('React + TypeScript + Vite')
})

const deployPath = resolve(root, '.github/workflows/deploy.yml')
if (existsSync(deployPath)) {
  checkFile('deploy.yml has pages: write', deployPath, out => out.includes('pages: write'))
  checkFile('deploy.yml has id-token: write', deployPath, out => out.includes('id-token: write'))
} else {
  console.log('⚠ .github/workflows/deploy.yml not found (optional, deploy not configured)')
}

try {
  const tokenInfo = execSync('gh auth status 2>&1', { encoding: 'utf8', shell: process.platform === 'win32' ? true : undefined })
  if (tokenInfo.includes('workflow')) {
    console.log('✓ gh token has workflow scope')
  } else {
    console.log('⚠ gh token missing workflow scope — CI/CD workflow updates will fail on push')
  }
} catch {
  console.log('⚠ could not check gh token scopes')
}

console.log('')
console.log('=== Summary ===')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)
console.log('')

process.exit(failed > 0 ? 1 : 0)
