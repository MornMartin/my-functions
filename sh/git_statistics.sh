#!/bin/bash

#根目录
rootpath=$(pwd)
#源码目录
source_codes=$rootpath
#统计时段
git_log_since="${1:-'2025-01-01'}"
git_log_until="${2:-'2025-03-31'}"

echo git_log_since：$git_log_since, git_log_until：$git_log_until

# GIT用户列表
declare -A user_map
user_map["xxx"]=xxx
user_map["xxx1"]=xxx

# 代码统计列表
declare -A commit_map

function get_log(){
  echo $(git log --all --since=$git_log_since --until=$git_log_until --author=$1 --pretty=short)
}

function get_authors() {
  echo $(git log --all --format="%aN" --since=$git_log_since --until=$git_log_until | sort -u)
}

function get_changes(){
  echo $(git show $1 --stat|grep insertion)
}

function get_note(){
  cut_str=$1
  echo $(git show $1 --stat --oneline |grep ${cut_str:0:7})
}

function get_date() {
  echo $(git show $1 -s --format=%cd --date=format:'%Y-%m-%d %H:%M')
}

function get_branch_name(){
  echo "$(git branch -r --contains $1)"
}
function export_data() {
	path=$1;
    echo "进入目录：" $source_codes/$path;
    cd $source_codes/$path;
    
    authors=$(get_authors)
    IFS=' ' read -ra author_array <<< "`echo $authors`"
    for author in "${author_array[@]}"; do
      if [[ -n $(echo $author | grep @) ]] || [[ -z ${user_map[$author]} ]]; then
        echo "未识别用户："$author""
      else
        git_log=$(get_log $author)
        if [ -n "$git_log" ]; then
          IFS=' ' read -ra array <<< "$git_log"
          status=0
          for commit in "${array[@]}"; do
            if [[ "$commit" == "commit" ]];then
              status=1
            else
              if [[ "$status" == "1" ]];then
                if [ -z ${commit_map[$commit]} ]; then
                  commit_map["$commit"]=1
                else
                  echo "重复数据：" $commit
                  status=0
                  continue
                fi
                note=$(get_note $commit | sed 's/,//g')
                branch_name=$(get_branch_name $commit | sed 's/,//g')
                date=$(get_date $commit| sed 's/,//g')
                changes=$(get_changes $commit)
                # eg: 2 files changed, 50 insertions(+), 19 deletions(-)
                IFS=',' read -ra changes_array <<< "$changes"
                add_num=$(echo ${changes_array[1]} | awk -F " " '{print $1}')
                changes_info=$(echo $changes | sed 's/,//g')
                echo "${add_num},${author},${user_map[$author]},${commit},${date},${changes_info},${note},${path}" >> $rootpath/logs.csv
              fi
              status=0
            fi
          done
        fi
      fi
    done
}

rm -rf $rootpath/logs.csv
touch $rootpath/logs.csv
for dir in $(ls $source_codes); do
    export_data $dir;
done
