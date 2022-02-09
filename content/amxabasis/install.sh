#!/bin/sh

cd $(dirname $0)


# binaries
for B in $(ls ./bin.d/*.sh); do
    if test -x $B; then
       echo "running $B"
       $B
    fi
done
# debian packages
for D in $(ls ./debs.d/*.deb);do
    echo "installing $(basename $D)"
    dpkg-deb -x $D  /
done
# part (no download!!!!!!)
for P in $(ls ./parts.d/*/install.sh); do
    if test -x $P; then
	echo "installing $(basename $(dirname $P))"
	$P
    fi
done






