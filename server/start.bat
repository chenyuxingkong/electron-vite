@echo off
if "%1"=="hide" goto CmdBegin
start mshta vbscript:createobject("wscript.shell").run("""%~0"" hide",0)(window.close)&&exit
:CmdBegin

%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat /ano ^| findstr 9297') do taskkill /F /pid %%a
start jre/bin/javaw -jar xc-zs-webserver-1.jar
