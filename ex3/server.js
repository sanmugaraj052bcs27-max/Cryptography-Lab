const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

function isPrime(n){
    if(n<=1) return false;
    for(let i=2;i<=Math.sqrt(n);i++){
        if(n%i==0) return false;
    }
    return true;
}

function gcd(a,b){
    while(b!=0){
        let t=b;
        b=a%b;
        a=t;
    }
    return a;
}

// Extended Euclidean Algorithm
function modInverse(e,phi){

    let t=0,newt=1;
    let r=phi,newr=e;

    while(newr!=0){
        let q=Math.floor(r/newr);

        [t,newt]=[newt,t-q*newt];
        [r,newr]=[newr,r-q*newr];
    }

    if(t<0) t=t+phi;

    return t;
}

// Modular exponentiation
function powerMod(base,exp,mod){

    let result=1;

    base=base%mod;

    while(exp>0){

        if(exp%2==1)
            result=(result*base)%mod;

        exp=Math.floor(exp/2);

        base=(base*base)%mod;
    }

    return result;
}

app.post("/rsa",(req,res)=>{

let {p,q,e,m}=req.body;

p=Number(p);
q=Number(q);
e=Number(e);
m=Number(m);

if(!isPrime(p)||!isPrime(q)){
return res.json({error:"p or q not prime"});
}

let n=p*q;
let phi=(p-1)*(q-1);

if(gcd(e,phi)!=1){
return res.json({error:"gcd(e,phi) must be 1"});
}

let d=modInverse(e,phi);

let encrypted=powerMod(m,e,n);
let decrypted=powerMod(encrypted,d,n);

res.json({
n:n,
phi:phi,
publicKey:`(${e},${n})`,
privateKey:`(${d},${n})`,
encrypted:encrypted,
decrypted:decrypted
});

});

app.listen(3000,()=>{
console.log("Server running at http://localhost:3000");
});
