#!/bin/bash
IFS=$'\n'  # 设置分隔符为换行符

format='+%Y-%m' #"+%Y-%m-%d %H:%M:%S"
if [ ${1//y/Y} == 'Y' ];then
	format='+%Y';
elif [ ${1//m/M} == 'M' ];then
	format='+%Y-%m';
elif [ ${1//d/D} == 'D' ];then
	format='+%Y-%m-%d'
fi

# 已存在目录列表
declare -A dir_map;

for dir in `ls -l | grep "^d" | awk '{print $9}'`;
do
	# 统计现有目录
	dir_map["$dir"]=true;
done

for file in `find . -maxdepth 1 -type f -not -name "*.sh" -printf "%f\n"`;
do
	mtime=$(ls -l --time-style=$format "$file" | awk '{print $6}');
	echo "$file" "-->" "$mtime";
	if [ -z ${dir_map["$mtime"]} ]; then
		# 目录不存在时创建目录
		mkdir $mtime;
		mv $file $mtime;
	else
		# 目录存在时移动文件
		mv $file $mtime;
	fi
	dir_map["$mtime"]=true;
done
