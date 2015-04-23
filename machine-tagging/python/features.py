import cv2
import numpy as np
import timeit
import image_functions
from skimage.filter import gabor_kernel
from scipy import ndimage as nd

kernels = []
for theta in range(4):
    theta = theta / 4. * np.pi
    for sigma in (1, 3):
        for frequency in (0.05, 0.25):
            kernel = np.real(gabor_kernel(frequency, theta=theta,
                                          sigma_x=sigma, sigma_y=sigma))
            kernels.append(kernel)

def gabor_features(filename):
    I = cv2.imread(filename).astype(np.float32)[:,:,1]
    feats = np.zeros((len(kernels), 2), dtype=np.double)
    for k, kernel in enumerate(kernels):
        filtered = nd.convolve(I, kernel, mode='wrap')
        feats[k, 0] = filtered.mean()
        feats[k, 1] = filtered.var()
    return np.concatenate(feats)

def color_features(filename):
    I = cv2.imread(filename).astype(np.float32)
    h, w, dim = I.shape
    G = np.mean(I, axis = 2)
    G2 = np.dstack((G,G,G))
    C = cv2.resize(np.subtract(I, G2), (8, 8))
    C = cv2.resize(C, (w, h))
    G3 = np.subtract(I, C)
    SI = np.median(cv2.cvtColor(I, cv2.COLOR_BGR2HSV)[:,:,1])
    SG3 = np.median(cv2.cvtColor(G3, cv2.COLOR_BGR2HSV)[:,:,1])
    I2 = cv2.resize(cv2.cvtColor(I, cv2.COLOR_BGR2HSV), (64,64))
    H = I2[:,:,0]
    S = I2[:,:,1]
    if np.sum(S) > 0:
        Hd = np.true_divide(np.sum(np.multiply(np.power(H,2),S)), h*w*np.sum(S)) - np.power(np.true_divide(np.sum(np.multiply(H,S)), h*w*np.sum(S)),2)
    else:
        Hd = np.std(H)
    return np.array([SI, SG3, Hd])

def color_features2(filename):
    I = cv2.imread(filename).astype(np.float32)
    h, w, dim = I.shape
    I2 = cv2.resize(cv2.cvtColor(I, cv2.COLOR_BGR2HSV), (64,64))
    H = I2[:,:,0]
    S = I2[:,:,1]
    if np.sum(S) > 0:
        print np.true_divide(np.sum(np.multiply(np.power(H,2),S)), h*w*np.sum(S)) - np.power(np.true_divide(np.sum(np.multiply(H,S)), h*w*np.sum(S)),2)
    else:
        print np.std(H)

def shape_features(filename):
    I = cv2.imread(filename).astype(np.float32)
    H = image_functions.shape_context(I)
    return np.concatenate(H)