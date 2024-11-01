
export interface IOutputConfig {
	/**
	 * 质量：0~1
	 */
	quality: number,
	/**
	 * 最大宽度(px)：默认1920
	 */
	maxWidth: number,
	/**
	 * 最大高度(px)：默认1080
	 */
	maxHeight: number,
	/**
	 * 图片格式：默认 image/png
	 */
	type: string,
}
/**
 * 获取绘制缩放比率
 * @param sourceWidth 源宽度
 * @param sourceHeight 源高度
 * @param maxWidth 最大允许宽度
 * @param maxHeight 最大允许高度
 * @returns 
 */
const getDrawScale = (sourceWidth: number, sourceHeight: number, maxWidth = 1920, maxHeight = 1080): number => {
	const scaleX = maxWidth / sourceWidth;
	const scaleY = maxHeight / sourceHeight;
	return Math.min(Math.min(scaleX, scaleY), 1);
}
/**
 * 获取默认配置
 * @param config 自定配置
 * @returns 
 */
const getDefaultConfig = (config?: IOutputConfig | Record<string, any>): IOutputConfig => {
	return {
		quality: config?.quality ?? 0.8,
		maxWidth: config?.maxWidth ?? 1920,
		maxHeight: config?.maxHeight ?? 1080,
		type: config?.type ?? 'image/png'
	}
}
/**
 * 获取导出名称
 * @param file 源
 * @param width 源高度
 * @param height 源宽度
 * @param type 导出图片格式
 * @returns 
 */
const getOutputName = (file: File, width: number, height: number, type: IOutputConfig['type']): string => {
	const filename = file.name.split('.').slice(0, -1).join('.');
	const fileType = type.split('/').pop();
	return `${filename}@${width}x${height}.${fileType}`;
}
/**
 * 获取绘制数据
 * @param source 源
 * @param width 源宽度
 * @param height 源高度
 * @param config 导出配置
 * @returns 
 */
const getDrawBlob = (source: HTMLImageElement | HTMLVideoElement, width: number, height: number, config?: IOutputConfig | Record<string, any>): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		try{
			const { quality, maxWidth, maxHeight, type } = getDefaultConfig(config);
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d") as CanvasRenderingContext2D;
			const scale = getDrawScale(width, height, maxWidth, maxHeight);
			canvas.width = width * scale;
			canvas.height = height * scale;
			context.fillStyle = 'transparent';
			context.drawImage(source, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => resolve(blob as Blob), type, quality);
		}catch(e) {
			reject(e);
		}
	})
}
/**
 * 获取图片封面（压缩图片）
 * @param file 图片文件
 * @param config 导出配置
 * @returns 
 */
export const getImgCover = (file: File, config?: IOutputConfig | Record<string, any>): Promise<File> => {
	return new Promise((resolve, reject) => {
		try {
			const url = window.URL.createObjectURL(file);
			const img = document.createElement("img");
			img.onload = async () => {
				if(!img.width || !img.height) return reject('No Image Content.');
				getDrawBlob(img, img.width, img.height, config).then(blob => {
					const { maxWidth, maxHeight, type } = getDefaultConfig(config);
					const scale = getDrawScale(img.width, img.height, maxWidth, maxHeight);
					const fileName = getOutputName(file, img.width * scale, img.height * scale, type);
					resolve(new File([blob as Blob], fileName));
					window.URL.revokeObjectURL(url);
				}, e => reject(e));
			};
			img.onerror = () => {
				reject(`Not Supported.`);
			}
			img.src = url;
		} catch (e) {
			reject(e);
		}
	});
}
/**
 * 获取视频封面
 * @param file 视频文件
 * @param frame 取自第几秒
 * @param config 导出配置
 * @returns 
 */
export const getVideoCover = (file: File, time = 1, config?: IOutputConfig | Record<string, any>): Promise<File> => {
	return new Promise((resolve, reject) => {
		try {
			const url = window.URL.createObjectURL(file);
			const video = document.createElement("video");
			video.currentTime = time;
			video.oncanplay = () => {
				if(!video.videoWidth || !video.videoHeight) return reject('No Video Content.');
				getDrawBlob(video, video.videoWidth, video.videoHeight, config).then(blob => {
					const { maxWidth, maxHeight, type } = getDefaultConfig(config);
					const scale = getDrawScale(video.videoWidth, video.videoHeight, maxWidth, maxHeight);
					const fileName = getOutputName(file, video.videoWidth * scale, video.videoHeight * scale, type);
					resolve(new File([blob as Blob], fileName));
					window.URL.revokeObjectURL(url);
				}, e => reject(e));
			}
			video.onerror = () => {
				reject(`Not Supported.`);
			}
			video.src = url;
		} catch (e) {
			reject(e);
		}
	});
}
