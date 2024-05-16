const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const statistics = {
  total: 0,
  failed: 0,
}
const tests = [];
function describe(scope, describeBody) {
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

    function skip() {
      console.error(`🟡 ${fullName} [skipped]`);
    }

    function toString(something) {
      const json = JSON.stringify(something);
      if (json === "{}") {
        return something.toString();
      }
      return json;
    }

    function expect(actual) {
      return {
        toEqual: expected => {
          if (actual !== expected) {
            fail(`expected ${toString(expected)}, got ${toString(actual)}.`);
          } else {
            pass();
          }
        },
        toNotEqual: expected => {
          if (actual === expected) {
            fail(`expected ${toString(actual)} not to equal ${toString(expected)}.`);
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
            fail(`expected to match snapshot\nApproved: ${approvedPath}\nReceived: ${receivedPath}\n`);
            try {
              child_process.execSync(
                `diff -y ${approvedPath} ${receivedPath}`,
                {stdio: 'inherit'}
              );
            } catch(ignored) {}
            console.log(`\nTo approve:\n  cp ${snapshotPath}.{received,approved}.txt`);
          } else {
            pass();
          }
        }
      }
    }

    body({ expect, fail, pass, skip });
  }

  tests.push(() => describeBody({ it }));
}

async function runAll() {
  console.log(`

  🔨 DIY Unit 🔨
  ~ a brutalist unit test framework ~

  `)
  tests.forEach(test => test());
  console.log('\n------------------------------------------------');
  console.log(`${statistics.total} tests run, ${statistics.failed} failed`);
}

module.exports = { describe, runAll };
