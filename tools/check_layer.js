const fs = require("fs"), path = require("path");
let ts, sfc;
try {
  ts = require("typescript");
} catch {
  ts = require(path.resolve(__dirname, "../web-admin/node_modules/typescript"));
}
try {
  sfc = require("@vue/compiler-sfc");
} catch {
  const pnpmDir = path.resolve(__dirname, "../web-admin/node_modules/.pnpm");
  if (fs.existsSync(pnpmDir)) {
    const sfcPkg = fs.readdirSync(pnpmDir).find(d => d.startsWith("@vue+compiler-sfc"));
    if (sfcPkg) {
      sfc = require(path.join(pnpmDir, sfcPkg, "node_modules/@vue/compiler-sfc"));
    }
  }
}
const root=process.env.LAYER_DIR || path.resolve(__dirname, "../layer");let files=[],bad=[];
(function walk(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?walk(p):files.push(p)}})(root);
let nts=0,nvue=0;
for(const f of files){
  if(f.endsWith(".ts")){nts++;const src=fs.readFileSync(f,"utf8");const r=ts.transpileModule(src,{reportDiagnostics:true,compilerOptions:{target:"ES2022",module:"ESNext"},fileName:f});
    for(const d of r.diagnostics||[])bad.push(f+": "+ts.flattenDiagnosticMessageText(d.messageText,"\n"))}
  if(f.endsWith(".vue")){nvue++;const src=fs.readFileSync(f,"utf8");const {descriptor,errors}=sfc.parse(src,{filename:f});errors.forEach(e=>bad.push(f+": parse "+e.message));
    if(descriptor.scriptSetup){try{const c=sfc.compileScript(descriptor,{id:"x"});const r=ts.transpileModule(c.content,{reportDiagnostics:true,compilerOptions:{target:"ES2022",module:"ESNext"}});for(const d of r.diagnostics||[])bad.push(f+": script "+ts.flattenDiagnosticMessageText(d.messageText,"\n"))}catch(e){bad.push(f+": compileScript "+e.message)}}
    if(descriptor.template){const t=sfc.compileTemplate({source:descriptor.template.content,filename:f,id:"x"});t.errors.forEach(e=>bad.push(f+": template "+(e.message||e)))}}
}
console.log("ts files:",nts,"vue files:",nvue);console.log(bad.length?bad.join("\n"):"SYNTAX/SFC CHECK OK");
