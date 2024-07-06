/* eslint-disable prettier/prettier */
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

const baseWidth = 350;
const baseHeight = 680;

const scaleWidth = screenWidth / 375;
const scaleHeight = screenHeight / 812;

const scale = (size) => width / baseWidth * size;
const verticalScale = (size) => height / baseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const normalize = (size, forHeight = false) => {
    const newSize = size * (forHeight ? scaleHeight : scaleWidth);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export { normalize, scale, verticalScale, moderateScale };
