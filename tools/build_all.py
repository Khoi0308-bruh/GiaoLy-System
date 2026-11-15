import subprocess,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
for s in ("fe_lint.py","build_layer.py","build_doc.py"):
    r=subprocess.run([sys.executable,"-B",s],capture_output=True,text=True);print(r.stdout.strip());
    if r.returncode:print(r.stderr[-800:]);sys.exit(1)
