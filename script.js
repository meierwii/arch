(function(){
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};
var D={mode:'easy',boot:'uefi',pc:'desktop',inst:'clean',cpu:'intel',gpu:['intel'],net:'eth',kern:'linux',fs:'ext4',enc:'no',swap:'zram',bl:'sdb',de:'gnome',x:[]};
var S=JSON.parse(JSON.stringify(D));
var F={disk:'/dev/sda',user:'user',host:'arch-pc',tz:'Europe/Moscow',esp:'',root:''};
var C=[
['mode','Уровень',[['easy','🌱 Новичок'],['pro','⚡ Опытный']]],
['boot','Режим загрузки',[['uefi','UEFI (новые ПК)'],['bios','BIOS / Legacy (старые)']]],
['pc','Компьютер',[['desktop','🖥 ПК'],['laptop','💻 Ноутбук'],['vm','📦 Виртуалка'],['mac','🍎 Mac на Intel']]],
['inst','Куда ставим',[['clean','На весь диск'],['dual','Рядом с Windows']]],
['cpu','Процессор',[['intel','Intel'],['amd','AMD'],['none','Не знаю / VM']]],
['gpu','Видеокарта (можно несколько)',[['intel','Intel'],['amd','AMD'],['nvidia','NVIDIA']],1],
['net','Интернет',[['eth','Кабель'],['wifi','Wi‑Fi']]],
['kern','Ядро',[['linux','linux'],['linux-lts','lts · стабильное'],['linux-zen','zen · отзывчивое'],['linux-hardened','hardened · защита']]],
['fs','Файловая система',[['ext4','ext4 · просто'],['btrfs','Btrfs · снапшоты'],['xfs','XFS']]],
['enc','Шифрование',[['no','Нет'],['luks','🔒 LUKS']]],
['swap','Подкачка',[['zram','zram · советую'],['part','Раздел'],['no','Нет']]],
['bl','Загрузчик',[['sdb','systemd-boot'],['grub','GRUB']]],
['de','Рабочий стол',[['gnome','GNOME'],['kde','KDE Plasma'],['cosmic','COSMIC'],['xfce','Xfce'],['cinnamon','Cinnamon'],['mate','MATE'],['hypr','Hyprland'],['sway','Sway'],['i3','i3'],['none','Без графики']]],
['x','Дополнительно',[['bt','Bluetooth'],['print','Печать'],['game','🎮 Steam'],['flat','Flatpak'],['aur','AUR'],['fw','Брандмауэр'],['ssh','SSH']],1]
];
var PR=[
['💻 Обычный ноутбук',{pc:'laptop',net:'wifi',gpu:['intel'],de:'gnome',x:['bt']}],
['🎮 Игровой ПК',{pc:'desktop',cpu:'amd',gpu:['amd'],kern:'linux-zen',de:'kde',x:['game','flat','aur']}],
['🪟 Рядом с Windows',{inst:'dual',de:'kde',x:['flat']}],
['🕰 Старый ПК',{boot:'bios',kern:'linux-lts',swap:'part',de:'xfce'}],
['📦 Виртуалка',{pc:'vm',cpu:'none',gpu:[],de:'gnome'}],
['🔒 Защищённый',{enc:'luks',fs:'btrfs',kern:'linux-hardened',de:'gnome',x:['fw']}],
['🖥 Только терминал',{de:'none',x:['ssh']}]
];
var DE={gnome:['gnome gnome-tweaks','gdm'],kde:['plasma-meta konsole dolphin kate','sddm'],cosmic:['cosmic','cosmic-greeter'],xfce:['xorg-server xfce4 xfce4-goodies lightdm lightdm-gtk-greeter','lightdm'],cinnamon:['xorg-server cinnamon gnome-terminal lightdm lightdm-gtk-greeter','lightdm'],mate:['xorg-server mate mate-extra lightdm lightdm-gtk-greeter','lightdm'],hypr:['hyprland kitty waybar wofi xdg-desktop-portal-hyprland sddm','sddm'],sway:['sway foot wmenu waybar swaybg swaylock xdg-desktop-portal-wlr',''],i3:['xorg-server i3-wm i3status dmenu xterm lightdm lightdm-gtk-greeter','lightdm'],none:['','']};
var DEN={gnome:'GNOME',kde:'KDE Plasma',cosmic:'COSMIC',xfce:'Xfce',cinnamon:'Cinnamon',mate:'MATE',hypr:'Hyprland',sway:'Sway',i3:'i3',none:'без графики'};

function win(code,l){return '<div class="win"><header><i></i><i></i><i></i><span>'+(l||'терминал')+'</span><button>Копировать</button></header><pre>'+esc(code)+'</pre></div>'}
function ed(path,kind,text,tip){
 var cap=kind=='find'?'Найди эти строки (поиск — <b>Ctrl+W</b>) и убери <code>#</code> в начале':kind=='edit'?'Найди строку (<b>Ctrl+W</b>) и приведи её к такому виду':'Впиши в файл';
 return '<div class="ed"><div class="eh"><span>GNU nano · '+path+'</span><button>Копировать</button></div><p class="ec">'+cap+(tip?'. '+tip:'')+'</p><pre>'+esc(text)+'</pre><div class="ef"><span><b>^O</b> + <b>Enter</b> сохранить</span><span><b>^X</b> выйти</span></div></div>'}
function nn(path,kind,text,tip){return win('nano '+path)+ed(path,kind,text,tip)}
var L=function(a){return a.filter(function(x){return x}).join('\n')};

function gen(){
var u=S.boot=='uefi',d=S.inst=='dual',lk=S.enc=='luks',bt=S.fs=='btrfs',k=S.kern,dk=F.disk;
var has=function(x){return S.x.indexOf(x)>-1},g=function(x){return S.gpu.indexOf(x)>-1};
var bl=(!u||d)?'grub':S.bl,efi=d?'/efi':'/boot';
var p=function(n){return dk+(/nvme|mmcblk/.test(dk)?'p':'')+n};
var n=1,A={};
if(!d){if(u)A.esp=p(n++);if(S.swap=='part')A.swp=p(n++);A.root=p(n++)}
var ESP=F.esp||A.esp||'/dev/РАЗДЕЛ_EFI',ROOT=F.root||A.root||'/dev/РАЗДЕЛ_ARCH',SWP=A.swp||'/dev/РАЗДЕЛ_SWAP',R=lk?'/dev/mapper/cryptroot':ROOT;
var uc=S.cpu=='intel'?'intel-ucode':S.cpu=='amd'?'amd-ucode':'';
var pv=S.pc=='vm',lap=S.pc=='laptop'||S.pc=='mac';
var St=[],T=function(ic,t,why,b){St.push({ic:ic,t:t,why:why,b:b})};

T('💾','Подготовь флешку','Нужна флешка от 4 ГБ. <b>Все данные на ней сотрутся.</b> Скачай образ на archlinux.org/download и запиши его на флешку.',
'<div class="nt"><b>Windows:</b> Rufus (режим «DD») или Ventoy. <b>Linux / macOS:</b> команда ниже, вместо <code>/dev/sdX</code> подставь флешку из <code>lsblk</code>.</div>'+win('sudo dd bs=4M if=archlinux-x86_64.iso of=/dev/sdX conv=fsync oflag=direct status=progress')+
'<p class="why">Перезагрузись и при старте жми <code>Del</code>, <code>F2</code>, <code>F12</code> или <code>Esc</code>'+(S.pc=='mac'?' (на Mac — держи <code>⌥ Option</code>)':'')+', выбери флешку'+(u?' с пометкой UEFI.':'.')+(d?' Заранее в Windows отключи «Быстрый запуск» и сожми диск C: через «Управление дисками» — освободи место под Arch.':'')+'</p>'+
(S.pc=='mac'?'<div class="nt">Mac на Intel: Wi‑Fi Broadcom заработает после <code>broadcom-wl</code> (добавлен ниже). Mac на Apple Silicon (M1–M4) — нужен Asahi Linux, не Arch.</div>':'')+(pv?'<div class="nt">Виртуалка: подключи ISO как диск. Для UEFI включи EFI в настройках VM.</div>':''));

T('📡','Подключи интернет','Установка скачивает программы из сети. '+(S.net=='eth'?'Кабель подхватывается сам.':'Wi‑Fi нужно подключить вручную.'),
win(L([S.net=='wifi'&&'rfkill unblock all',S.net=='wifi'&&'iwctl',S.net=='wifi'&&'  station wlan0 scan',S.net=='wifi'&&'  station wlan0 get-networks',S.net=='wifi'&&'  station wlan0 connect ИМЯ_СЕТИ',S.net=='wifi'&&'  exit','ping -c 3 archlinux.org']))+'<div class="nt ok">Ответы с временем — значит всё хорошо. Телефон по USB-тетерингу заменяет кабель.</div>');

T('✏️','Поставь редактор nano','Все файлы в этом руководстве мы правим через <b>nano</b> — простой редактор прямо в терминале. Стрелки двигают курсор, мышь не нужна.',
win('sudo pacman -S nano')+'<div class="nt ok">В live-образе ты уже root: если <code>sudo</code> не найден, выполни просто <code>pacman -S nano</code>. Если пишет «уже установлен» — отлично.</div>'+
'<table><tr><th>Клавиши</th><th>Что делают</th></tr><tr><td><code>Ctrl+O</code>, затем <code>Enter</code></td><td>сохранить файл</td></tr><tr><td><code>Ctrl+X</code></td><td>выйти</td></tr><tr><td><code>Ctrl+W</code></td><td>поиск по файлу</td></tr><tr><td><code>Ctrl+K</code></td><td>вырезать строку</td></tr></table>'+
'<p class="why">Блоки с <b>зелёной рамкой</b> ниже — это содержимое файла в nano. Скопируй его кнопкой и вставь (в терминале: <code>Ctrl+Shift+V</code>).</p>');

T('🔎','Проверка и время','Убеждаемся, что режим загрузки совпадает с выбором, и включаем синхронизацию времени.',
win(L(['setfont cyr-sun16',u?'cat /sys/firmware/efi/fw_platform_size   # должно быть 64':'ls /sys/firmware/efi   # должно быть: нет такой папки','timedatectl set-ntp true','lsblk'])));

T('🧩','Разметь диск',d?'Ставим рядом с Windows: берём только свободное место, Windows не трогаем.':'Делим диск на части — как нарезать пирог: часть под загрузку, часть под систему.',
win('cfdisk '+dk)+(d?'<div class="nt">В cfdisk выбери <b>Free space</b> → <b>New</b> → тип <b>Linux filesystem</b> → Write. <b>Не трогай</b> разделы Windows и существующий EFI. Пути впиши в поля «EFI» и «Раздел Arch» выше.</div>'+(lk?'<div class="nt">LUKS вместе с Windows — сложный случай, сверься с ArchWiki (dm-crypt).</div>':''):
'<table><tr><th>Раздел</th><th>Размер</th><th>Тип</th><th>Зачем</th></tr>'+(u?'<tr><td>'+ESP+'</td><td>1 ГБ</td><td>EFI System</td><td>загрузка</td></tr>':'')+(S.swap=='part'?'<tr><td>'+SWP+'</td><td>4–8 ГБ</td><td>Linux swap</td><td>подкачка</td></tr>':'')+'<tr><td>'+ROOT+'</td><td>всё остальное</td><td>Linux filesystem</td><td>система</td></tr></table><p class="why">В начале cfdisk выбери <b>'+(u?'gpt':'dos')+'</b>. Сохрани: Write → yes → Quit.</p>'));

var fm=[];
if(!d&&u)fm.push('mkfs.fat -F32 '+ESP);
if(!d&&S.swap=='part')fm.push('mkswap '+SWP,'swapon '+SWP);
if(lk)fm.push('cryptsetup luksFormat '+((!u||d)?'--type luks1 ':'')+ROOT,'cryptsetup open '+ROOT+' cryptroot');
fm.push(S.fs=='ext4'?'mkfs.ext4 '+R:S.fs=='xfs'?'mkfs.xfs -f '+R:'mkfs.btrfs -f '+R);
if(bt)fm.push('mount '+R+' /mnt','btrfs subvolume create /mnt/@','btrfs subvolume create /mnt/@home','umount /mnt','mount -o subvol=@,compress=zstd,noatime '+R+' /mnt','mount --mkdir -o subvol=@home,compress=zstd,noatime '+R+' /mnt/home');else fm.push('mount '+R+' /mnt');
if(u)fm.push('mount --mkdir '+ESP+' /mnt'+efi);
T('🧱','Форматирование и подключение','Форматирование «готовит» разделы к записи, монтирование — подключает их в папку /mnt.'+(lk?' Придумай и запомни пароль шифрования: без него диск не открыть.':''),win(L(fm))+(d?'<div class="nt ok">EFI-раздел Windows не форматируем — только подключаем.</div>':''));

var pk=['base',k,k+'-headers','linux-firmware',uc,'base-devel','nano','sudo','networkmanager','wpa_supplicant','man-db','man-pages','git'];
if(bt)pk.push('btrfs-progs');if(S.fs=='xfs')pk.push('xfsprogs');if(lk)pk.push('cryptsetup');if(S.swap=='zram')pk.push('zram-generator');
if(bl=='grub'){pk.push('grub');if(u)pk.push('efibootmgr');if(d)pk.push('os-prober','ntfs-3g')}
if(S.pc=='mac')pk.push('broadcom-wl');
T('📦','Установи базовую систему','Ставим ядро <code>'+k+'</code>'+(uc?', микрокод процессора':'')+', сеть, sudo и nano.',win('pacstrap -K /mnt '+pk.filter(Boolean).join(' '))+'<p class="why">Самый долгий шаг: 5–15 минут.</p>');

T('🚪','Войди в новую систему','<code>genfstab</code> записывает, какие диски подключать при старте. <code>arch-chroot</code> переносит тебя внутрь установленной системы.',win('genfstab -U /mnt >> /mnt/etc/fstab\narch-chroot /mnt')+'<div class="nt ok">Дальше команды выполняются <b>внутри</b> новой системы, до самой перезагрузки.</div>');

var cf='<h4>Часовой пояс</h4>'+win('ln -sf /usr/share/zoneinfo/'+F.tz+' /etc/localtime\nhwclock --systohc')+
'<h4>Языки</h4>'+nn('/etc/locale.gen','find','ru_RU.UTF-8 UTF-8\nen_US.UTF-8 UTF-8')+win('locale-gen')+nn('/etc/locale.conf','add','LANG=ru_RU.UTF-8')+nn('/etc/vconsole.conf','add','KEYMAP=ru\nFONT=cyr-sun16')+
'<h4>Имя компьютера</h4>'+nn('/etc/hostname','add',F.host)+nn('/etc/hosts','add','127.0.0.1 localhost\n::1       localhost\n127.0.1.1 '+F.host+'.localdomain '+F.host)+
'<h4>Пароль администратора и сеть</h4>'+win('passwd\nsystemctl enable NetworkManager.service');
if(S.swap=='zram')cf+='<h4>Подкачка zram</h4>'+nn('/etc/systemd/zram-generator.conf','add','[zram0]\nzram-size = min(ram / 2, 4096)');
if(lk)cf+='<h4>Шифрование</h4>'+nn('/etc/mkinitcpio.conf','edit','HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block encrypt filesystems fsck)','Главное — слово <code>encrypt</code> перед <code>filesystems</code>')+win('mkinitcpio -P');
T('⚙️','Настрой систему','Часовой пояс, язык, имя компьютера и пароль <b>root</b> (администратор). Пароль при вводе не отображается — это нормально.',cf);

var ro,bc;
if(bl=='sdb'){
 ro=(lk?'cryptdevice=UUID=ТВОЙ_UUID:cryptroot root=/dev/mapper/cryptroot':'root=UUID=ТВОЙ_UUID')+(bt?' rootflags=subvol=@':'')+' rw';
 bc=win('bootctl install')+nn('/boot/loader/loader.conf','add','default arch.conf\ntimeout 3\neditor no')+win('blkid -s UUID -o value '+ROOT)+'<div class="nt">Команда выше покажет длинный UUID — запомни или скопируй его и подставь вместо <code>ТВОЙ_UUID</code> ниже.</div>'+
 nn('/boot/loader/entries/arch.conf','add',L(['title Arch Linux','linux /vmlinuz-'+k,uc&&'initrd /'+uc+'.img','initrd /initramfs-'+k+'.img','options '+ro]))}
else{
 bc=win(u?'grub-install --target=x86_64-efi --efi-directory='+efi+' --bootloader-id=Arch':'grub-install --target=i386-pc '+dk);
 if(lk)bc+=win('blkid -s UUID -o value '+ROOT);
 if(lk||d)bc+=nn('/etc/default/grub','edit',L([lk&&'GRUB_ENABLE_CRYPTODISK=y',lk&&'GRUB_CMDLINE_LINUX="cryptdevice=UUID=ТВОЙ_UUID:cryptroot root=/dev/mapper/cryptroot"',d&&'GRUB_DISABLE_OS_PROBER=false']),'Если строки нет — добавь её в конец файла'+(lk?'. UUID бери из команды выше':''));
 bc+=win('grub-mkconfig -o /boot/grub/grub.cfg')}
T('🥾','Установи загрузчик','Загрузчик — первая программа при включении ПК. Она запускает Linux'+(d?' и даёт выбрать Windows':'')+'. Для тебя: <b>'+(bl=='sdb'?'systemd-boot':'GRUB')+'</b>.',bc+((S.bl=='sdb'&&(d||!u))?'<div class="nt">Для BIOS и dual boot автоматически выбран GRUB.</div>':''));

T('👤','Создай пользователя','Работать под root небезопасно. Создаём обычного пользователя с правами администратора через <code>sudo</code>.',win('useradd -m -G wheel -s /bin/bash '+F.user+'\npasswd '+F.user+'\nEDITOR=nano visudo')+ed('/etc/sudoers','find','%wheel ALL=(ALL:ALL) ALL','Строка уже есть с решёткой в начале'));

var dp=[],sv=[],gp=[];
if(DE[S.de][0])dp.push(DE[S.de][0]);if(DE[S.de][1])sv.push(DE[S.de][1]+'.service');
if(g('intel'))gp.push('mesa vulkan-intel intel-media-driver');if(g('amd'))gp.push('mesa vulkan-radeon libva-mesa-driver');
if(g('nvidia'))gp.push(k=='linux'?'nvidia-open nvidia-utils nvidia-settings':'nvidia-open-dkms nvidia-utils nvidia-settings');
if(g('nvidia')&&(g('intel')||g('amd')))gp.push('nvidia-prime');
if(S.de!='none')dp.push('pipewire pipewire-pulse pipewire-alsa wireplumber noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-liberation');
if(S.de!='none'&&!pv)dp.push(gp.join(' '));
if(pv)dp.push('qemu-guest-agent spice-vdagent'),sv.push('qemu-guest-agent.service');
if(lap){dp.push('power-profiles-daemon brightnessctl');sv.push('power-profiles-daemon.service')}
if(has('bt')){dp.push('bluez bluez-utils');sv.push('bluetooth.service')}
if(has('print')){dp.push('cups');sv.push('cups.socket')}
if(has('flat'))dp.push('flatpak');
if(has('fw')){dp.push('ufw');sv.push('ufw.service')}
if(has('ssh')){dp.push('openssh');sv.push('sshd.service')}
var l32=[];if(g('intel'))l32.push('lib32-vulkan-intel');if(g('amd'))l32.push('lib32-vulkan-radeon');if(g('nvidia'))l32.push('lib32-nvidia-utils');
var pc=dp.join(' ').replace(/\s+/g,' ').trim()+(has('game')?' steam '+l32.join(' '):''),db='';
if(has('game'))db+='<h4>Включи 32-битные библиотеки для Steam</h4>'+nn('/etc/pacman.conf','find','[multilib]\nInclude = /etc/pacman.d/mirrorlist','Две строки подряд')+win('pacman -Syu');
if(pc)db+='<h4>Установка</h4>'+win(L(['pacman -S --needed '+pc,sv.length&&'systemctl enable '+sv.join(' ')]));else db+='<div class="nt">Графика не выбрана — пропусти этот шаг, у тебя будет терминал.</div>';
T('🎨','Рабочий стол и драйверы','Ставим графику ('+DEN[S.de]+'), звук, шрифты и драйверы твоего железа и включаем нужные службы.',db+(S.de=='sway'?'<div class="nt">Sway запускается командой <code>sway</code> после входа.</div>':'')+(g('nvidia')?'<div class="nt">NVIDIA: <code>nvidia-open</code> — для RTX 20xx и новее. Для GTX 10xx и старше нужен драйвер из AUR.</div>':'')+(S.de=='hypr'?'<div class="nt">Hyprland настраивается через <code>~/.config/hypr</code>. Новичку лучше GNOME или KDE.</div>':''));

T('🔁','Перезагрузись','Выходим из новой системы, отключаем диски, чтобы данные точно записались, и перезагружаем компьютер.',win('exit\numount -R /mnt'+(lk?'\ncryptsetup close cryptroot':'')+'\nreboot')+'<div class="nt ok">Вытащи флешку. '+(lk?'При старте введи пароль шифрования. ':'')+'Войди под пользователем <code>'+F.user+'</code>.</div>');

T('🚀','Первые шаги в системе','Обновляем систему и подключаем дополнительные магазины программ.',win(L(['sudo pacman -Syu',has('aur')&&'git clone https://aur.archlinux.org/yay-bin.git && cd yay-bin && makepkg -si',has('flat')&&'flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo',has('fw')&&'sudo ufw enable','sudo systemctl enable --now fstrim.timer'])));
return St}

function prog(){var a=document.querySelectorAll('.st'),dn=document.querySelectorAll('.st.dn');$('#pg').style.width=(a.length?dn.length/a.length*100:0)+'%';$('#fin').className='fin'+(a.length&&a.length==dn.length?' on':'')}
function render(){
var dn={};[].forEach.call(document.querySelectorAll('.st.dn'),function(e){dn[e.dataset.t]=1});
var h='';gen().forEach(function(s,i){h+='<article class="st'+(dn[s.t]?' dn':'')+'" data-t="'+s.t+'"><header><span class="no">'+(dn[s.t]?'✓':i+1)+'</span><h3>'+s.ic+' '+s.t+'</h3><span class="ck">отметить ✓</span></header><p class="why">'+s.why+'</p>'+s.b+'</article>'});
$('#out').innerHTML=h;document.getElementById('m').className=S.mode=='pro'?'pro':'';
var lb=function(c,v){for(var i=0;i<c[2].length;i++)if(c[2][i][0]==v)return c[2][i][1];return v};
var sm='<b>Твоя сборка:</b>';C.forEach(function(c){if(c[0]=='mode'||(c[0]=='bl'&&(S.boot!='uefi'||S.inst=='dual')))return;var v=S[c[0]];(c[3]?v:[v]).forEach(function(x){sm+='<span>'+lb(c,x)+'</span>'})});
$('#sum').innerHTML=sm;prog()}
function ctl(){
var h='<div class="inp"><label>Диск<input data-f="disk" value="'+esc(F.disk)+'" spellcheck="false"></label><label>Пользователь<input data-f="user" value="'+esc(F.user)+'" spellcheck="false"></label><label>Имя ПК<input data-f="host" value="'+esc(F.host)+'" spellcheck="false"></label><label>Часовой пояс<input data-f="tz" value="'+esc(F.tz)+'" spellcheck="false"></label>'+(S.inst=='dual'?'<label>EFI-раздел Windows<input data-f="esp" value="'+esc(F.esp)+'" placeholder="/dev/sda1" spellcheck="false"></label><label>Раздел Arch<input data-f="root" value="'+esc(F.root)+'" placeholder="/dev/sda5" spellcheck="false"></label>':'')+'</div>';
C.forEach(function(c){
 if(c[0]=='bl'&&(S.boot!='uefi'||S.inst=='dual'))return;
 h+='<div class="grp"><label>'+c[1]+'</label><div class="seg" data-k="'+c[0]+'" data-m="'+(c[3]?1:0)+'">';
 c[2].forEach(function(o){var on=c[3]?S[c[0]].indexOf(o[0])>-1:S[c[0]]==o[0];h+='<button type="button" data-v="'+o[0]+'" class="'+(on?'on':'')+'">'+o[1]+'</button>'});
 h+='</div></div>'});
$('#ctl').innerHTML=h}

document.addEventListener('click',function(e){
 var t=e.target,b=t.closest('.seg button');
 if(b){var s=b.parentNode,k=s.dataset.k,v=b.dataset.v;
  if(s.dataset.m=='1'){var i=S[k].indexOf(v);if(i>-1)S[k].splice(i,1);else S[k].push(v);if(k=='gpu'&&!S.gpu.length&&S.pc!='vm')S.gpu=[v]}else S[k]=v;
  if(k=='pc'&&v=='vm'){S.cpu='none';S.gpu=[]}
  ctl();render();return}
 var pb=t.closest('.pre button');
 if(pb){var P=PR[+pb.dataset.i][1],m=S.mode;S=JSON.parse(JSON.stringify(D));S.mode=m;for(var q in P)S[q]=P[q];ctl();render();return}
 var c=t.closest('.win button,.ed button');
 if(c){var tx=c.parentNode.parentNode.querySelector('pre').textContent;try{navigator.clipboard.writeText(tx);c.textContent='Готово ✓';setTimeout(function(){c.textContent='Копировать'},1300)}catch(x){}return}
 var h=t.closest('.st>header');
 if(h){h.parentNode.classList.toggle('dn');h.querySelector('.no').textContent=h.parentNode.classList.contains('dn')?'✓':[].indexOf.call(document.querySelectorAll('.st'),h.parentNode)+1;prog()}
});
document.addEventListener('input',function(e){var f=e.target.dataset&&e.target.dataset.f;if(f){F[f]=e.target.value.trim();if((f=='disk'||f=='user'||f=='host'||f=='tz')&&!F[f])F[f]={disk:'/dev/sda',user:'user',host:'arch-pc',tz:'Europe/Moscow'}[f];render()}});
$('#pre').innerHTML=PR.map(function(p,i){return '<button type="button" data-i="'+i+'">'+p[0]+'</button>'}).join('');
$('#hw').innerHTML=win('ls /sys/firmware/efi        # есть папка → UEFI\nlscpu | grep "Model name"   # Intel или AMD\nlspci | grep -iE "vga|3d"   # видеокарта\nlsblk                       # диски и их имена','терминал в live-системе');
$('#th').onclick=function(){var r=document.documentElement,cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');r.dataset.theme=cur=='dark'?'light':'dark'};
ctl();render();
})();
