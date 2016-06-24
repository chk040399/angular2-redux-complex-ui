
import {Http, Response} from '@angular/http'

export const LOADING_IMAGE_DATA = 'LOADING_IMAGE_DATA'
export const LOAD_IMAGE_DATA = 'LOAD_IMAGE_DATA'
export const SORT_IMAGES = 'SORT_IMAGES'
export const EXCLUDE_IMAGE_TAGS = 'EXCLUDE_IMAGE_TAGS'
export const CLEAR_CURRENT_IMAGE = 'CLEAR_CURRENT_IMAGE'
export const SELECT_CURRENT_IMAGE = 'SELECT_CURRENT_IMAGE'
export const CHANGE_IMAGE_TITLE = 'CHANGE_IMAGE_TITLE'
export const UPDATE_IMAGE_TAGS = 'UPDATE_IMAGE_TAGS'

export enum ImageSortBy {
    title,
    size,
    date
}

export function loadingImages() {
    return {
        type: LOADING_IMAGE_DATA
    }
}

export function loadImageData(imageData) {
    return {
        type: LOAD_IMAGE_DATA,
        payload: imageData
    }
}

export function loadImageDataError(errorMessage) {
    return {
        type: LOAD_IMAGE_DATA,
        payload: {
            message: errorMessage
        },
        error: true
    }
}

export function sortImages(sortBy: ImageSortBy, isAscending: boolean = true) {
    return {
        type: SORT_IMAGES,
        payload: { sortBy, isAscending }
    }
}

export function excludeImageTags(excludedTags: string[]) {
    return {
        type: EXCLUDE_IMAGE_TAGS,
        payload: { excludedTags }
    }
}

export function imageDataRequest(http: Http) {
    return dispatch => {
        dispatch(loadingImages())
        http.get('/api/images')
            .map(res => res.json())
            .map(imageData => imageData.map((img: any) => Object.assign(img, {
                dateTaken: new Date(img.dateTaken)
            })))
            .subscribe(
                (imageData: any) => dispatch(loadImageData(imageData)),
                (err: Response) => dispatch(loadImageDataError(err.json().error || 'Server error'))
            )
    }
}

export function clearCurrentImage() {
    return {
        type: CLEAR_CURRENT_IMAGE
    }
}

export function selectCurrentImage(imageId: string) {
    return {
        type: SELECT_CURRENT_IMAGE,
        payload: { imageId }
    }
}

export function changeImageTitle(imageId: string, title: string) {
    return {
        type: CHANGE_IMAGE_TITLE,
        payload: { imageId, title }
    }
}

export function updateImageTags(imageId: string, tags: string[]) {
    return {
        type: UPDATE_IMAGE_TAGS,
        payload: { imageId, tags }
    }
}
