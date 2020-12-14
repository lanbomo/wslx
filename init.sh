#! /bin/bash

# [ -f /home/wslx-boot.sh ] \
# && \
#     [ -f /tmp/wslx-is-boot.temp ] \
#     && echo "the boot shell is executed" \
#     || bash /home/wslx-boot.sh && touch /tmp/wslx-is-boot.temp && echo "executed boot shell successfully"\
# || echo -e "#! /bin/bash\n\n#service ssh start" >> /home/wslx-boot.sh

if [ -f /home/wslx-boot.sh ]
then
    if [ -f /tmp/wslx-is-boot.temp ]
    then
        echo "the boot shell is executed"
    else
        bash /home/wslx-boot.sh && touch /tmp/wslx-is-boot.temp && echo "executed boot shell successfully"
    fi
else
    echo -e "#! /bin/bash\n\n#service ssh start" >> /home/wslx-boot.sh && echo "you can modify /home/wslx-boot.sh to execute command when wsl booted"
fi