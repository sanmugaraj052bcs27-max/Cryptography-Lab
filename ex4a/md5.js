function leftRotate(x, c) {
    return (x << c) | (x >>> (32 - c));
}

function toHex(num) {
    return ("00000000" + (num >>> 0).toString(16)).slice(-8);
}

function stringToBytes(str) {
    return new TextEncoder().encode(str);
}

function generateMD5WithSteps(message) {
    let steps = "";

    // STEP 1: Convert to bytes
    const msgBytes = stringToBytes(message);
    const originalBitLength = msgBytes.length * 8;

    steps += "===== STEP 1: ORIGINAL MESSAGE =====\n";
    steps += `Message: ${message}\n`;
    steps += `Length (bits): ${originalBitLength}\n\n`;

    // STEP 2: Padding
    let padded = Array.from(msgBytes);
    padded.push(0x80);

    while ((padded.length * 8) % 512 !== 448) {
        padded.push(0);
    }

    for (let i = 0; i < 8; i++) {
        padded.push((originalBitLength >>> (8 * i)) & 0xff);
    }

    const totalBlocks = padded.length / 64;

    steps += "===== STEP 2: PADDING =====\n";
    steps += `Padded Length (bits): ${padded.length * 8}\n`;
    steps += `Number of 512-bit Blocks: ${totalBlocks}\n\n`;

    // STEP 3: Initialize Buffers
    let A = 0x67452301;
    let B = 0xefcdab89;
    let C = 0x98badcfe;
    let D = 0x10325476;

    steps += "===== STEP 3: INITIALIZE BUFFERS =====\n";
    steps += `A=${toHex(A)} B=${toHex(B)} C=${toHex(C)} D=${toHex(D)}\n\n`;

    // Constants
    const K = Array.from({ length: 64 }, (_, i) =>
        Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)
    );

    const S = [
        7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
        5,9,14,20, 5,9,14,20, 5,9,14,20, 5,9,14,20,
        4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
        6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21
    ];

    // STEP 4 & 5: Process Blocks
    for (let i = 0; i < padded.length; i += 64) {
        steps += `\n================ BLOCK ${(i/64)+1} ================\n`;

        let M = [];
        for (let j = 0; j < 64; j += 4) {
            M.push(
                padded[i+j] |
                (padded[i+j+1] << 8) |
                (padded[i+j+2] << 16) |
                (padded[i+j+3] << 24)
            );
        }

        steps += "\nWords (16 × 32-bit):\n";
        for (let x = 0; x < 16; x++) {
            steps += `M[${x}] = ${toHex(M[x])}\n`;
        }

        let a = A, b = B, c = C, d = D;

        for (let k = 0; k < 64; k++) {
            let F, g, round;

            if (k < 16) {
                F = (b & c) | (~b & d);
                g = k;
                round = 1;
            } else if (k < 32) {
                F = (d & b) | (~d & c);
                g = (5*k + 1) % 16;
                round = 2;
            } else if (k < 48) {
                F = b ^ c ^ d;
                g = (3*k + 5) % 16;
                round = 3;
            } else {
                F = c ^ (b | ~d);
                g = (7*k) % 16;
                round = 4;
            }

            let beforeAdd = F;
            F = (F + a + K[k] + M[g]) >>> 0;

            steps += `\nBlock ${(i/64)+1} | Round ${round} | Iteration ${k+1}\n`;
            steps += "--------------------------------------------\n";
            steps += `a=${toHex(a)} b=${toHex(b)} c=${toHex(c)} d=${toHex(d)}\n`;
            steps += `F(before add)=${toHex(beforeAdd)}\n`;
            steps += `M[g]=${toHex(M[g])}  g=${g}\n`;
            steps += `K[k]=${toHex(K[k])}\n`;

            a = d;
            d = c;
            c = b;
            b = (b + leftRotate(F, S[k])) >>> 0;

            steps += "Updated buffers:\n";
            steps += `a=${toHex(a)} b=${toHex(b)} c=${toHex(c)} d=${toHex(d)}\n`;
            steps += "============================================\n";
        }

        A = (A + a) >>> 0;
        B = (B + b) >>> 0;
        C = (C + c) >>> 0;
        D = (D + d) >>> 0;

        steps += "\nAfter Block Processing:\n";
        steps += `A=${toHex(A)} B=${toHex(B)} C=${toHex(C)} D=${toHex(D)}\n`;
        steps += "====================================================\n";
    }

    steps += "\n===== FINAL MD5 HASH =====\n";
    const hash = toHex(A) + toHex(B) + toHex(C) + toHex(D);
    steps += `128-bit Hash: ${hash}\n`;

    return { steps, hash };
}

module.exports = { generateMD5WithSteps };
