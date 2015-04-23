import numpy as np

# IMAGES MUST BE RGB

def white_balance(image):
    height, width, channels = image.shape
    image_out = np.copy(image).astype(np.float32)
    for channel_number in range(0,channels):
        channel = image_out[:,:,channel_number]
        high = np.percentile(channel, 95)
        low = np.percentile(channel, 5)

        channel = np.true_divide(np.maximum(np.minimum(channel,high) - low, 0), high - low)
        image_out[:,:,channel_number] = channel

    return image_out

def desaturate(image, type):
    image_out = np.copy(image).astype(np.float32)

    if type == 'lightness':
        max_RGB = np.max(image_out, axis=2)
        min_RGB = np.min(image_out, axis=2)
        for channel_number in range(0,3):
            image_out[:,:,channel_number] = (0.5/255.0)*np.add(max_RGB, min_RGB)
        return image_out

    elif type == 'luminosity':
        image_out[:,:,0] = np.add(0.21*image_out[:,:,0], np.add(0.72*image_out[:,:,1], 0.07*image_out[:,:,2])) / 255.0
        for channel_number in range(1,3):
            image_out[:,:,channel_number] = image_out[:,:,0]
        return image_out

    elif type == 'average':
        for channel_number in range(0,3):
            image_out[:,:,channel_number] = np.mean(image, axis=2) / 255.0
        return image_out

def shape_context(image):
    h, w, _ = image.shape
    X, Y = np.meshgrid(np.linspace(0, w - 1, w), np.linspace(0, h - 1, h))
    gray_image_inverted = 1 - desaturate(image, 'lightness')[:,:,0]
    centre_of_mass = np.array([np.sum(np.multiply(gray_image_inverted, Y))/np.sum(gray_image_inverted), np.sum(np.multiply(gray_image_inverted, X))/np.sum(gray_image_inverted)])
    log_distance = np.log(np.sqrt(np.add(np.power(Y - centre_of_mass[0], 2),np.power(X - centre_of_mass[1], 2))))/np.log(np.sqrt(h**2 + w**2))
    angle = np.arctan2(Y - centre_of_mass[0], X - centre_of_mass[1])
    sc, _, _ = np.histogram2d(log_distance.flatten(), angle.flatten(), 8, range=[[0,1],[-np.pi,np.pi]], weights=gray_image_inverted.flatten())
    return sc/np.sum(gray_image_inverted)

def image_distance(image1, image2):
    return np.mean(np.sqrt(np.power(np.subtract(image2[:,:,0], image1[:,:,0]), 2) + np.power(np.subtract(image2[:,:,1], image1[:,:,1]), 2) + np.power(np.subtract(image2[:,:,2], image1[:,:,2]), 2)))

def color_distance(image):
    gray1 = desaturate(image, 'lightness')
    gray2 = desaturate(image, 'luminosity')
    gray3 = desaturate(image, 'average')

    distance1 = np.sum(np.power(np.subtract(gray1, image), 2), axis=2)
    distance2 = np.sum(np.power(np.subtract(gray2, image), 2), axis=2)
    distance3 = np.sum(np.power(np.subtract(gray3, image), 2), axis=2)

    return np.mean(np.sqrt(np.minimum(distance1, np.minimum(distance2, distance3))))