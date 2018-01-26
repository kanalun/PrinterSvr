@echo off
call ./EVN.bat
call "%cd%\%NSSM%" stop %SERV_NAME%
echo ***************************************************************
echo *                                                             *
echo *       服务已经停止!需要启动请"双击"运行start.bat脚本        *
echo *                     玩的开心:)                              *
echo *                                                             *
echo ***************************************************************
pause