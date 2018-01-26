@echo off
call ./EVN.bat
call "%cd%\%NSSM%" start %SERV_NAME%
echo ***************************************************************
echo *                                                             *
echo *       服务已经启动!需要启动请"双击"运行stop.bat脚本         *
echo *                     玩的开心:)                              *
echo *                                                             *
echo ***************************************************************
pause