@echo off
call ./EVN.bat
call "%cd%\%NSSM%" stop %SERV_NAME%
call "%cd%\%NSSM%" remove %SERV_NAME% confirm
echo ����ɾ���ɹ�
pause
