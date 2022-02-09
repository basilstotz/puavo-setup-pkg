#/bin/sh
cd $(dirname $0)

for P in $(ls bin/*sh); do
    $P
done

    
