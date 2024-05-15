const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function describe(scope, tests) {
  console.log(`

  🔨 DIY Unit 🔨
  ~ the "good enough" testing stuff ~

  `)
  const statistics = {
    total: 0,
    failed: 0,
  }
  function it(test, body) {
    const fullName = `${scope} ${test}`;
    statistics.total += 1;

    function fail(message) {
      console.error(`❌ ${fullName}: ${message}`);
      statistics.failed += 1;
    }

    function pass() {
      console.error(`✅ ${fullName}`);
    }

    function expect(actual) {
      return {
        toEqual: expected => {
          if (actual !== expected) {
            fail(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
          } else {
            pass();
          }
        },
        toMatchSnapshot: () => {
          const snapshotPath = path.join(__dirname, 'snapshots', fullName.replace(/[^a-zA-Z0-9]+/g, '-'));
          const approvedPath = snapshotPath + '.approved.txt';
          const receivedPath = snapshotPath + '.received.txt';
          const actualString = actual;
          fs.writeFileSync(receivedPath, actualString, { flag: 'w' });
          try { fs.writeFileSync(approvedPath, '', { flag: 'wx' }); } catch(ignored) {}
          const approvedString = fs.readFileSync(approvedPath, 'utf-8');
          if (actualString !== approvedString) {
            fail('expected to match snapshot');
            try {
              child_process.execSync(
                `diff -y ${approvedPath} ${receivedPath}`,
                {stdio: 'inherit'}
              );
            } catch(ignored) {}
          } else {
            pass();
          }
        }
      }
    }

    body({ expect, fail, pass });
  }

  tests({ it });
  console.log('\n------------------------------------------------');
  console.log(`${statistics.total} tests run, ${statistics.failed} failed`);
}

module.exports = { describe };
