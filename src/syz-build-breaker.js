var exports = module.exports;

exports.run = function (coverage, gateWay) {
  printHeader();

  if (coverage < gateWay) {
    console.error(
      `ERROR: Expected SYZ Coverage to be ${gateWay}%. Actual coverage is ${coverage}%. See details above.`
    );
    process.exit(1);
  } else {
    console.log('INFO:', 'SYZ coverage gate status: OK');
  }
};

function printHeader() {
  console.log('\n');
  console.log('SYZ BuildBreaker');
  console.log('================');
}
