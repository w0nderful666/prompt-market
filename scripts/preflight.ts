#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const __dirname = new URL('.', import.meta.url).pathname
const root = resolve(__dirname, '..')

let passed = 0
let failed = 0

function run(desc, cmd, checkFn) {
  try {
    const out = execSync(cmd, { cwd: root, encoding: 'utf8', stdio: 'pipe' })
    if (checkFn && !checkFn(out)) {
      console.log('✗ ' + desc + ' (check failed)')
      failed++
    } else {
      console.log('✓ ' + desc)
      passed++
    }
  } catch (e) {
    console.log('✗ ' + desc + ': ' + (e.stderr || e.message).trim().split('\n').slice(0, 3).join('; '))
    failed++
  }
}

console.log('')
console.log('=== Preflight Check ===')
console.log('')

run('npm run build compiles', 'npm run build 2>&1', out => !out.includes('error'))
run('npm run self-test passes', 'npm run self-test 2>&1', out => out.includes('FAIL: 0'))

run('vite base is /prompt-market-react/', 'cat vite.config.ts', out => {
  return out.includes("base: '/prompt-market-react/'")
})

run('README is not Vite default', 'cat README.md 2>/dev/null | head -5', out => {
  return out && !out.includes('React + TypeScript + Vite')
})

if (failed > 0) {
  // Check deploy.yml only as optional
  try {
    const deploy = readFileSync(resolve(root, '.github/workflows/deploy.yml'), 'utf8')
    if (deploy.includes('pages: write') || deploy.includes('pages:')) {
      console.log('✓ .github/workflows/deploy.yml has pages permissions')
      passed++
    }
  } catch {
    console.log('⚠ .github/workflows/deploy.yml not found (optional)')
  }
}

console.log('')
console.log('=== Summary ===')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)
console.log('')

process.exit(failed > 0 ? 1 : 0)
