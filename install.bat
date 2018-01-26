@echo off
set _NOW=%date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%
:: echo %_NOW% >> service.log
set SERV_NAME=XDPrinterSvr
if /i "%PROCESSOR_ARCHITECTURE%"=="AMD64" (set NSSM=nssm64.exe) else (set NSSM=nssm32.exe)
call "%cd%\%NSSM%" install %SERV_NAME% "printers.exe" "%index.js"
call "%cd%\%NSSM%" set %SERV_NAME% AppDirectory "%cd%"
call "%cd%\%NSSM%" start %SERV_NAME%

echo ***************************************************************
echo *                                                             *
echo *              已经向WIN注册为XDPrinterSvr~                   *
echo * 在浏览器输入http://127.0.0.1:9200/status查看打印服务器地址! *
echo *              玩的开心:)                                     *
echo ***************************************************************
pause
