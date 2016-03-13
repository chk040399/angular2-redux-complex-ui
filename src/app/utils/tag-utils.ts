import _ from 'lodash'

export function areAllTagsExcluded(tagList, excludedTags) {
    tagList = tagList || []
    return tagList.length > 0 && _.every(tagList, tag => isExcludedTag(tag, excludedTags))
}

export function isExcludedTag(tag, selectedTags) {
    return _.some(selectedTags || [], selectedTag => isMatchingTag(selectedTag, tag));
}

export function isMatchingTag(tag1, tag2) {
    return tagCompareValue(tag1) === tagCompareValue(tag2);
}

export function tagCompareValue(tag) {
    return (tag || '').toLocaleLowerCase();
}

export function getSelectedTagsList(imageDataSet, excludedTags) {
    return _(_.values(imageDataSet))
        .map((v: any, k: any) => v.tags || [])
        .flatten()
        .filter(v => !!v)
        .map(tagCompareValue)
        .uniq()
        .sortBy(v => v)
        .map((tag: string) => ({
            tag,
            isSelected: !_.some(excludedTags, (exTag: string) => isMatchingTag(tag, exTag))
        }))
        .value()
}

export function getExcludedTagsFromSelectedTagsList(tagsList) {
    return _(tagsList)
        .filter((v: any) => !v.isSelected)
        .map((v: any) => v.tag)
        .value()
}