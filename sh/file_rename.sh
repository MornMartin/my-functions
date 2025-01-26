IFS=$'\n';

suffix=".jfif";
[ "${1}" != "" ] && suffix=$1;

current=`date "+%Y-%m-%d %H:%M:%S"`;
timeStamp=`date -d "$current" +%s`;
currentTimeStamp=$((timeStamp*1000+10#`date "+%N"`/1000000));

index=0;
for file in `ls *$suffix`;
do
    index=$(($index + 1));
    fileName="$currentTimeStamp-$index$suffix";
    echo $file $fileName;
    mv $file $fileName;
done
