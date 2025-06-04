#!/bin/bash

declare -A file_map;

rootpath="$(pwd)"

source_dir="${rootpath}${1}";
target_dir="${rootpath}${2}";
result_dir="${rootpath}${3:-/results}"

function get_file_name() {
    file=$1;
    IFS='.' read -ra suffixes <<< "`echo $file`";
    suffix=${suffixes[-1]};
    echo $file | tr -d ".${suffix}";
}

function get_source_files() {
    for file in `find $source_dir -maxdepth 1 -type f -not -name "*.sh" -printf "%f\n"`;
    do
        file_name=$(get_file_name $file);
        file_map["$file_name"]=true;
    done
}

function copy_target_file() {
    cp "${target_dir}/${1}" $result_dir;
    echo cp "$target_dir/$1" ">>>" $result_dir;
}

function get_target_files() {
    for file in `find $target_dir -maxdepth 1 -type f -not -name "*.sh" -printf "%f\n"`;
    do
        file_name=$(get_file_name $file);
        if [ ${file_map[$file_name]} ]; then
            copy_target_file $file;
        else
            continue
        fi
    done
}

if [ ! -d "$result_dir" ]; then
    # 如果不存在则创建目录
    mkdir -p "$result_dir";
fi

get_source_files;
get_target_files;
