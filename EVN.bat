@echo off
set _NOW=%date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%
:: echo %_NOW% >> service.log
set SERV_NAME=XDPrinterSvr
if /i "%PROCESSOR_ARCHITECTURE%"=="AMD64" (set NSSM=nssm64.exe) else (set NSSM=nssm32.exe)

