#!/bin/bash

set -u

cd "$(dirname "$0")" || exit 1
shopt -s nullglob nocaseglob

VIDEO_HEIGHT="${VIDEO_HEIGHT:-1080}"
VIDEO_CRF="${VIDEO_CRF:-28}"
VIDEO_PRESET="${VIDEO_PRESET:-medium}"
VIDEO_MAXRATE="${VIDEO_MAXRATE:-2500k}"
VIDEO_BUFSIZE="${VIDEO_BUFSIZE:-5000k}"
KEEP_AUDIO="${KEEP_AUDIO:-0}"
IMAGE_QUALITY="${IMAGE_QUALITY:-82}"
OUTPUT_DIR="${OUTPUT_DIR:-compressed}"

VIDEO_OUT_DIR="${OUTPUT_DIR}/videos"
IMAGE_OUT_DIR="${OUTPUT_DIR}/images"

video_done=0
video_failed=0
image_done=0
image_failed=0

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "缺少依赖: $cmd"
        return 1
    fi
}

mkdir -p "$VIDEO_OUT_DIR" "$IMAGE_OUT_DIR"

if ! require_cmd ffmpeg; then
    exit 1
fi

if ! require_cmd cwebp; then
    echo "缺少 cwebp，图片压缩会跳过。"
    HAVE_CWEBP=0
else
    HAVE_CWEBP=1
fi

echo "======================================================="
echo "开始批量压缩当前目录下的视频和图片"
echo "视频输出: $VIDEO_OUT_DIR"
echo "图片输出: $IMAGE_OUT_DIR"
echo "视频参数: height=${VIDEO_HEIGHT}, crf=${VIDEO_CRF}, preset=${VIDEO_PRESET}, keep_audio=${KEEP_AUDIO}"
echo "图片参数: webp quality=${IMAGE_QUALITY}"
echo "======================================================="

compress_video() {
    local src="$1"
    local base="${src%.*}"
    local out="${VIDEO_OUT_DIR}/${base}.mp4"
    local -a audio_args

    if [[ -e "$out" ]]; then
        echo "⏭️  跳过已存在视频: $out"
        return 0
    fi

    if [[ "$KEEP_AUDIO" == "1" ]]; then
        audio_args=(-c:a aac -b:a 128k)
    else
        audio_args=(-an)
    fi

    echo "🎬 压缩视频: $src"
    if ffmpeg -hide_banner -loglevel error -y -i "$src" \
        -vf "scale=-2:'min(${VIDEO_HEIGHT},ih)'" \
        -c:v libx264 -preset "$VIDEO_PRESET" -crf "$VIDEO_CRF" \
        -maxrate "$VIDEO_MAXRATE" -bufsize "$VIDEO_BUFSIZE" \
        "${audio_args[@]}" \
        -movflags +faststart \
        "$out" < /dev/null; then
        echo "✅ 视频完成: $out"
        video_done=$((video_done + 1))
    else
        echo "❌ 视频失败: $src"
        video_failed=$((video_failed + 1))
    fi
}

compress_image() {
    local src="$1"
    local base="${src%.*}"
    local out="${IMAGE_OUT_DIR}/${base}.webp"

    if [[ "$HAVE_CWEBP" != "1" ]]; then
        return 0
    fi

    if [[ -e "$out" ]]; then
        echo "⏭️  跳过已存在图片: $out"
        return 0
    fi

    echo "🖼️  压缩图片: $src"
    if cwebp -quiet -q "$IMAGE_QUALITY" "$src" -o "$out"; then
        echo "✅ 图片完成: $out"
        image_done=$((image_done + 1))
    else
        echo "❌ 图片失败: $src"
        image_failed=$((image_failed + 1))
    fi
}

video_files=( *.mp4 *.mov *.m4v *.avi *.mkv *.webm )
image_files=( *.jpg *.jpeg *.png *.webp )

for f in "${video_files[@]}"; do
    [[ -f "$f" ]] || continue
    compress_video "$f"
done

for f in "${image_files[@]}"; do
    [[ -f "$f" ]] || continue
    compress_image "$f"
done

echo "======================================================="
echo "任务完成"
echo "视频: 成功 ${video_done} 个, 失败 ${video_failed} 个"
echo "图片: 成功 ${image_done} 个, 失败 ${image_failed} 个"
echo "输出目录: ${OUTPUT_DIR}"
echo "======================================================="
