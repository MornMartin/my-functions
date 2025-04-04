#!/bin/bash

#根目录
rootpath=$(pwd)
#分支名称
git_branch_name="${1:-'master'}"
#源码目录
source_codes="$rootpath/$git_branch_name"

echo git_branch_name：$git_branch_name

#工程列表
projects=(
    "git@xxxx1.git"
    "git@xxxx2.git"
)

# 代码统计列表
declare -A line_map

function get_clone() {
    repo=$1;
    cd $source_codes;
    $(git clone -b $git_branch_name $repo);
}


rm -rf $source_codes
mkdir $source_codes
for project in "${projects[@]}"; do
	get_clone $project;
done

