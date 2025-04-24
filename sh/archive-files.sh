#!/bin/bash
IFS=$'\n';  # 处理文件名中含空格时被挡车多个文件的问题
#根目录
rootpath=$(pwd)
#归档方式
type=1;
#日期格式
date_format='+%Y-%m'; #"+%Y-%m-%d %H:%M:%S"
# 目录列表
declare -A dir_map;

# 统计现有目录
function record_dirs() {
	for dir in `ls $rootpath -l | grep "^d" | awk '{print $9}'`;
	do
		dir_map["$dir"]=true;
	done
}

# 设置日期归档格式
function set_date_format() {
	echo "请选择按日期归档类型："
	echo "  Y. 按年归档（YYYY）"
	echo "  M. 按月归档（YYYY-MM）"
	echo "  D. 按天归档（YYYY-MM-DD）"
	read -p "请输入Y/M/D：" date_format_selected;

	if [ $date_format_selected ];then
		if [ ${date_format_selected//y/Y} == 'Y' ];then
			date_format='+%Y';
		elif [ ${date_format_selected//m/M} == 'M' ];then
			date_format='+%Y-%m';
		elif [ ${date_format_selected//d/D} == 'D' ];then
			date_format='+%Y-%m-%d';
		fi
	fi

	echo 归档格式：$date_format;
}

# 归档文件
function archive_file() {
	file=$1
	dir=$2
	echo "$file" "-->" "$rootpath/$dir";
	if [ -z ${dir_map["$dir"]} ]; then
		# 目录不存在时创建目录
		mkdir $rootpath/$dir;
		mv $rootpath/$file $rootpath/$dir;
	else
		# 目录存在时移动文件
		mv $rootpath/$file $rootpath/$dir;
	fi
	dir_map["$dir"]=true;
}

# 通过日期归档文件
function archive_by_date() {
	for file in `find $rootpath -maxdepth 1 -type f -not -name "*.sh" -printf "%f\n"`;
	do
		mtime=$(ls "$rootpath/$file" -l --time-style=$date_format  | awk '{print $6}');
		archive_file $file $mtime;
	done
}

# 通过后缀归档文件
function archive_by_suffix() {
	for file in `find $rootpath -maxdepth 1 -type f -not -name "*.sh" -printf "%f\n"`;
	do
		IFS='.' read -ra suffixes <<< "`echo $file`";
		suffix=${suffixes[-1]};
		archive_file $file $suffix;
	done
}

echo 操作目录： $rootpath;
echo 请选择归档方式：
echo "  1. 按时间归档（YYYY-MM-DD/YYYY-MM/YYYY）"
echo "  2. 按文件类型归档（jpg/zip/txt...）"
read -p "请输入1/2：" type;

if [ "$type" == "1" ];then
	record_dirs;
	set_date_format;
	archive_by_date;
elif [ "$type" == "2" ];then
	record_dirs;
	archive_by_suffix;
else
	echo 未进行任何归档操作
fi
