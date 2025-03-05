IFS=$'\n';
base=$(pwd);
# 遍历文件夹（一层）并批量执行命令
# 如：sh xxx.sh "echo hello" "echo world"
for dir in `ls -d */`;
do
    cd $base/$dir;
    echo $(pwd);
    for cmd in $*;
    do
        eval $cmd;
    done
done
