let logBox, keyBox;

function hex2bin(hex){
  const map={0:'0000',1:'0001',2:'0010',3:'0011',4:'0100',5:'0101',6:'0110',7:'0111',
             8:'1000',9:'1001',A:'1010',B:'1011',C:'1100',D:'1101',E:'1110',F:'1111'};
  return hex.toUpperCase().split('').map(x=>map[x]).join('');
}
function bin2hex(bin){
  const map={"0000":'0',"0001":'1',"0010":'2',"0011":'3',"0100":'4',"0101":'5',"0110":'6',"0111":'7',
             "1000":'8',"1001":'9',"1010":'A',"1011":'B',"1100":'C',"1101":'D',"1110":'E',"1111":'F'};
  let out="";
  for(let i=0;i<bin.length;i+=4) out+=map[bin.substr(i,4)];
  return out;
}
function xor(a,b){ let r=""; for(let i=0;i<a.length;i++) r+=(a[i]^b[i]); return r; }
function permute(inp,arr){ return arr.map(i=>inp[i-1]).join(""); }
function shift_left(k,n){ return k.slice(n)+k.slice(0,n); }

function log(msg){ logBox.textContent += msg + "\n"; }
function logKey(msg){ keyBox.textContent += msg + "\n"; }


const IP=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,
57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
const FP=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,
36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
const PC1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,
60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
const PC2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,
41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
const shiftTable=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
const E=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,
16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
const P=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];



const SBOX=[
[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]
];

function generateKeys(keyHex){
  let key=permute(hex2bin(keyHex),PC1);
  let l=key.substr(0,28), r=key.substr(28,28);
  let keys=[];
  for(let i=0;i<16;i++){
    l=shift_left(l,shiftTable[i]);
    r=shift_left(r,shiftTable[i]);
    let k=permute(l+r,PC2);
    keys.push(k);
    logKey("K"+(i+1)+" : "+bin2hex(k));
  }
  return keys;
}

function sboxSub(inp){
  let out="";
  for(let i=0;i<8;i++){
    let b=inp.substr(i*6,6);
    let r=parseInt(b[0]+b[5],2);
    let c=parseInt(b.substr(1,4),2);
    out+=("0000"+SBOX[i][r][c].toString(2)).slice(-4);
  }
  return out;
}

function fFun(r, key, round) {
    log("\nRound " + round );
    log("R input (32-bit): " + bin2hex(r));
    
    let expanded = permute(r, E);
    log("Expanded R (48-bit): " + bin2hex(expanded));

    let xorWithKey = xor(expanded, key);
    log("After XOR with K"+round+" (48-bit): " + bin2hex(xorWithKey));

    let sboxOut = sboxSub(xorWithKey);
    log("After S-box (32-bit): " + bin2hex(sboxOut));

    let permuted = permute(sboxOut, P);
    log("After P-permutation (32-bit): " + bin2hex(permuted));
    
    return permuted;
}


function DESblock(hex, key, decrypt = false){
    let keys = generateKeys(key);
    if (decrypt) keys.reverse();

    let data = permute(hex2bin(hex), IP);
    let l = data.substr(0,32), r = data.substr(32,32);

    log("\nInitial L0: " + bin2hex(l));
    log("Initial R0: " + bin2hex(r));

    for(let i=0;i<16;i++){
        let temp = r;
        r = xor(l, fFun(r, keys[i], i+1));  
        l = temp;
        log("After Round " + (i+1) + "  L=" + bin2hex(l) + "  R=" + bin2hex(r));
    }

    let preOutput = r + l;
    let finalOut = permute(preOutput, FP);
    log("\nAfter Final Permutation (FP): " + bin2hex(finalOut));
    return bin2hex(finalOut);
}


function pkcs7Pad(hex){
  let bytes = hex.length / 2;  
  let blockSize = 8;           
  let padLen = blockSize - (bytes % blockSize);
  if(padLen === 0) padLen = 8;
  let padHex = padLen.toString(16).padStart(2,'0');
  let padding = "";
  for(let i=0;i<padLen;i++) padding += padHex;
  return hex + padding;
}

function pkcs7Unpad(hex){
  let lastByte = hex.slice(-2);
  let padLen = parseInt(lastByte,16);
  if(padLen <=0 || padLen > 8) return hex;
  return hex.slice(0, -(padLen*2));
}

function splitBlocks(hex){
  let a=[];
  for(let i=0;i<hex.length;i+=16) a.push(hex.substr(i,16));
  return a;
}

// ---------------- Encryption / Decryption ----------------
function encryptDES(mode){
  logBox=document.getElementById("log");
  keyBox=document.getElementById("keyLog");
  logBox.textContent=""; keyBox.textContent="";

  let pt = pkcs7Pad(document.getElementById("plainText").value.trim());
  let key=document.getElementById("desKey").value.trim();
  let iv=document.getElementById("iv").value.trim();

  let blocks=splitBlocks(pt);
  let out="";
  log(mode+" ENCRYPTION START\n");

  let prev = iv;  // for CBC

  blocks.forEach((b,i)=>{
    log("\n--- Block "+(i+1)+" ---");
    log("Input block: "+b);
    let inputHex = b;

    if(mode==='CBC'){
      let xorHex = bin2hex(xor(hex2bin(b),hex2bin(prev)));
      log("After XOR with IV/Prev: "+xorHex);
      inputHex = xorHex;
    }

    let c = DESblock(inputHex,key,false);
    log("Final ciphertext for Block "+(i+1)+": "+c+"\n");
    out += c;

    if(mode==='CBC') prev = c;
  });

  document.getElementById("cipherText").value = out;
}

function decryptDES(mode){
  logBox=document.getElementById("log");
  keyBox=document.getElementById("keyLog");
  logBox.textContent=""; keyBox.textContent="";

  let ct=document.getElementById("cipherText").value.trim();
  let key=document.getElementById("desKey").value.trim();
  let iv=document.getElementById("iv").value.trim();

  let blocks=splitBlocks(ct);
  let out="";
  log(mode+" DECRYPTION START\n");

  let prev = iv;  // for CBC

  blocks.forEach((b,i)=>{
    log("\n--- Block "+(i+1)+" ---");
    log("Cipher block: "+b);

    let p = DESblock(b,key,true);

    let plain = (mode==='CBC') ? bin2hex(xor(hex2bin(p),hex2bin(prev))) : p;

    if(mode==='CBC') log("After XOR with IV/Prev: "+plain);

    log("Decrypted block: "+plain+"\n");

    out += plain;
    if(mode==='CBC') prev = b;
  });

  out = pkcs7Unpad(out);
  document.getElementById("decryptedText").value = out;
}
