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
          console.log('todo');
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
