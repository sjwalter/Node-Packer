var packer = require('../lib/packer');

var packed = packer.pack('BBL', 10, 244, 1064);
var unpacked = packer.unpack('BBL', packed);

if(unpacked[0] == 10) {
    console.log('Unpacked byte 0 correctly');
} else {
    console.log('Failed to unpack byte 0. Expected 10, got: ' + unpacked[0]);
}

if(unpacked[2] == 1064) {
    console.log('Unpacked byte 2 correctly');
} else {
    console.log('Failed to unpack byte 2. Expected 1064, got: ' + unpacked[2]);
}
