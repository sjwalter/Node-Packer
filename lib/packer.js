function pack(format) {
    var argIndex = 1;
    var args = arguments;

    if(args[1] instanceof Array) {
        // We were passed an array of data to pack
        args = arguments[1];
        argIndex = 0;
    }

    // Because node Buffers can't be resized, we store the result
    // as an array of Buffers and keep track of the total length,
    // then return a new buffer from this array at the end.
    var result = new Array();
    var totalLength = 0;

    // TODO: Byte order first-char
    // For now, we're assuming '!' (Network--big-endian). This is
    // different from python's struct.pack assumption that the
    // default is @ (native size and byte order).
    var formatIndex = 0;

    switch(format[0]) {
    case '@':
    case '=':
    case '<':
    case '>':
    case '!':
        // Don't do anything with these right now, and maybe
        // I can't (can I manipulate the byte-orderings?)
        // Just keeping this here to ensure compatibility
        // with python's struct.pack, which I'm only doing
        // so that I have to write less documentation.
        formatIndex = 1;
        break;
    }

    for(; formatIndex < format.length; formatIndex++) {
        var curType = format[formatIndex];
        var curAddition;
        switch(curType) {
        case 'x':
            // Pad byte, just one empty byte.
            var tmp = new Buffer(1);
            tmp[0] = 0;
            result.push(tmp);
            totalLength += 1;
            break;
        case 'c':
        case 'b':
        case 'B':
            // Character, one byte.
            var tmp = new Buffer(1);
            var character = args[argIndex];
            if(typeof character != 'number') {
                character = parseInt(character);
            }
            if(character > 255) {
                throw new Error('Can not pack a B-type from an int > 255');
            }
            tmp[0] = character;
            result.push(tmp);
            totalLength += 1;
            break;
        case 'I':
        case 'L':
            // unsigned integer/long, 4 bytes
            var tmp = new Buffer(4);
            var num = args[argIndex];
            if(typeof num != 'number') {
                num = parseInt(num);
            }
            tmp[0] = num & 255;
            tmp[1] = num >> 8 & 255;
            tmp[2] = num >> 16 & 255;
            tmp[3] = num >> 24 & 255;
            result.push(tmp);
            totalLength += 4;
            break;
        default:
            throw new Error('Unsupported packing type: ' + curType);
            break;
        }
        argIndex += 1;
    }

    // Prepare the actual return buffer
    var ret = new Buffer(totalLength);
    var retIndex = 0;
    for(var i = 0; i < result.length; i++) {
        var curResult = result[i];
        for(var j = 0; j < curResult.length; j++) {
            ret[retIndex] = curResult[j];
            retIndex += 1;
        }
    }
    return ret;
}

function unpack(format, buffer) {
    if(!(buffer instanceof Buffer)) {
        throw new Error('unpack expects a second argument of type Buffer');
    }

    var formatIndex = 0;
    var bufferIndex = 0;
    var result = new Array();

    switch(format[0]) {
    case '@':
    case '=':
    case '>':
    case '<':
    case '!':
        formatIndex = 1;
        break;
    }

    for(; formatIndex < format.length; formatIndex++) {
        var curType = format[formatIndex];

        switch(curType) {
        case 'x':
            // Just a pad byte. Next!
            bufferIndex += 1;
            break;
        case 'c':
        case 'b':
        case 'B':
            result.push(parseInt(buffer[bufferIndex]));
            bufferIndex += 1;
            break;
        case 'I':
        case 'L':
            var num = 
                parseInt((buffer[bufferIndex + 3] & 255) << 24) +
                parseInt((buffer[bufferIndex + 2] & 255) << 16) +
                parseInt((buffer[bufferIndex + 1] & 255) << 8) +
                parseInt(buffer[bufferIndex] & 255);
            result.push(num);
            bufferIndex += 4;
            break;
        default:
            throw new Error('Unsupported format type: ' + curType);
            break;
        }
    }
    return result;
}

module.exports.pack = pack;
module.exports.unpack = unpack;
