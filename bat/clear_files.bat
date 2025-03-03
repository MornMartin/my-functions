@echo off

@REM 忽略当前脚本文件
set self=%0
set currentDir=%~dp0

choice /M "To clear all files in %currentDir% , Yes or No ?"
if %errorlevel% EQU 1 goto toClear

:end
echo Quit
exit

:toClear
echo To clear:
for /R %currentDir% %%i in (*) do (
    if /i %%i NEQ %self:"=% (
        echo %%i
        @REM powershell "(Get-Item \"%%i\").VersionInfo.ProductName"
    )
)
pause
for /R %currentDir% %%i in (*) do (
    if /i %%i NEQ %self:"=% (
        del "%%i" /f /q
        fsutil file createnew "%%i" 10240
    )
)
echo Clear successfully.
pause
                                   
