var packer = require('../lib/packer');

var packed = packer.pack('BBLI', 100, 244, 1064, 2044);
var unpacked = packer.unpack('BBLI', packed);

console.log('Dump of packed data (ascii-encoded): ' + packed.toString('ascii'));
console.log('Dump of unpacked data: ' + JSON.stringify(unpacked));

// BBL is 1 + 1 + 4 = 6 bytes; hence, packed should have length of 6
if(packed.length == 10) {
    console.log('Packed data is of correct length (10)');
} else {
    console.log('Expected packed length of 10, but instead got ' 
        + packed.length);
}

if(unpacked[0] == 100) {
    console.log('Unpacked byte 0 correctly');
} else {
    console.log('Failed to unpack byte 0. Expected 10, got: ' + unpacked[0]);
}

if(unpacked[2] == 1064) {
    console.log('Unpacked byte 2 correctly');
} else {
    console.log('Failed to unpack byte 2. Expected 1064, got: ' + unpacked[2]);
}

if(unpacked[3] == 2044) {
    console.log('Unpacked 3rd index correctly');
} else {
    console.log('Failed to unpack 3rd index. Expected 2044, got: '
        + unpacked[3]);
}
