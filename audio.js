var body = document.body;
// 播放按钮
var playPause = document.getElementsByClassName('playPause')[0];
var audio = document.getElementById('audioTag');
var recordImg = document.getElementById('record-img');
// 上一首下一首
var beforeMusic = document.getElementsByClassName('beforeMusic')[0];
var nextMusic = document.getElementsByClassName('nextMusic')[0];
// 歌曲信息
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-container')[0];
// 播放时间
var playedTime = document.getElementsByClassName('played-time')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];

var progressPlay = document.getElementsByClassName('progress-play')[0];
// 播放模式
var playMode = document.getElementsByClassName('playMode')[0];
// 音量
var volume = document.getElementsByClassName('volume')[0];
var volumeTogger = document.getElementById('volume-togger');

var speed = document.getElementById('speed');

var closeContainer = document.getElementsByClassName('close-container')[0];
var listContainer = document.getElementsByClassName('list-container')[0];
var listIcon = document.getElementById('list');

var musicList = document.getElementsByClassName('musicLists')[0];
// 歌曲名称
var musicData = [
    ['计科专升本6班', '吴涛苑26216950620'],
    ['Yesterday', 'Alok/Sofi Tukker'],
    ['江南烟雨色', '杨树人'],
    ['Vision pt.II', 'Vicetone'],
];

var musicId = 0;
function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('retate-play');
    // 当音乐原数据完成加载时触发函数
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
        musicTitle.innerText = musicData[musicId][0];
        authorName.innerText = musicData[musicId][1];
        body.style.backgroundImage = `url('img/bg${musicId}.png')`;
        refreshRotate();
        totalTime.innerText = formatTime(audio.duration);
        audio.currentTime = 0;
    }
}
initMusic();

function initAndPlay() {
    initMusic();
    audio.play();
    rotateRecord();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');

}

// 点击播放按钮
playPause.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
})

function rotateRecord() {
    recordImg.style.animationPlayState = 'running';
}

function rotateRecordStop() {
    recordImg.style.animationPlayState = 'paused';
}

function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

nextMusic.addEventListener('click', function () {
    musicId++;
    if (musicId > musicData.length - 1) {
        musicId = 0;
    }
    initAndPlay();
})

beforeMusic.addEventListener('click', function () {
    musicId--;
    if (musicId < 0) {
        musicId = musicData.length - 1;
    }
    initAndPlay();
})
// 时间格式化
function formatTime(time) {
    var hour = parseInt(time / 3600);
    var minute = parseInt((time % 3600) / 60);
    var second = parseInt(time % 60);
    if (hour > 0) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    } else {
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }
}

audio.addEventListener('timeupdate', updateProgress);
// 音乐进度更新
function updateProgress() {
    playedTime.innerText = formatTime(audio.currentTime);
    if (audio.currentTime >= audio.duration) {
        audio.pause();
    }
    var value = (audio.currentTime / audio.duration) * 100;
    progressPlay.style.width = value + '%';
}

// 音乐模式
var modeId = 1;
playMode.addEventListener('click', function () {
    modeId++;
    if (modeId > 3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeId}.png')`;

})

audio.addEventListener('ended', function () {
    nextMusic.click();
    if (modeId == 2) {
        musicId = (musicId + 1) % musicData.length;
    } else if (modeId == 3) {
        var oldId = musicId;
        while (oldId == musicId) {
            musicId = Math.floor(Math.random() * musicData.length);
        }
    }
    initAndPlay();
})

var lastVolume = 70;
audio.volume = lastVolume / 100;

// 音量控制
volume.addEventListener('click', setVolume);
function setVolume() {
    if (audio.muted || audio.volume == 0) {
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volume = lastVolume / 100;
    } else {
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumeIcon();

}
volumeTogger.addEventListener('input', updateVolume);
// 音量滑动块
function updateVolume() {
    const volumeValue = volumeTogger.value / 100;
    audio.volume = volumeValue;
    if (volumeValue > 0) {
        audio.muted = false;
        updateVolumeIcon();
    }
}

//更新音量
function updateVolumeIcon() {
    if (audio.muted || audio.volume == 0) {
        volume.style.backgroundImage = `url('img/静音.png')`;
    } else {
        volume.style.backgroundImage = `url('img/音量.png')`;
    }
}

// 倍速
speed.addEventListener('click', function () {
    if (audio.playbackRate == 1) {
        audio.playbackRate = 1.5;
        speed.innerText = '1.5x';
    } else if (audio.playbackRate == 1.5) {
        audio.playbackRate = 2;
        speed.innerText = '2.0x';
    } else {
        audio.playbackRate = 1;
        speed.innerText = '1.0x';
    }
})
listIcon.addEventListener('click', function () {
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    closeContainer.style.display = 'block';
    listContainer.style.display = 'block';
})

closeContainer.addEventListener('click', function () {
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display = 'none';
    // listContainer.style.display = 'none';
})

function createMusic() {
    for (let i = 0; i < musicData.length; i++) {
        let div = document.createElement('div');
        div.innerText = musicData[i][0];
        musicList.appendChild(div);
        div.addEventListener('click', function () {
            musicId = i;
            initAndPlay();
            listContainer.classList.remove('list-show');
            listContainer.classList.add('list-hide');
            closeContainer.style.display = 'none';
            // listContainer.style.display = 'none';
        })
    }
}
document.addEventListener('DOMContentLoaded', createMusic);
