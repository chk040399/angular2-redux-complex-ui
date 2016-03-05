
import _ from 'lodash'
import {Component} from 'angular2/core'
import {AppStore} from '../../services/app-store'
import {AppStoreSubscriber, IAppStoreSubscriber} from '../../decorators/app-store-subscriber'
import {sortImages, ImageSortBy} from '../../actions/images-actions'
import {ImageDetailTable} from './image-detail-table'

@Component({
    selector: 'image-detail-list',
    directives: [ImageDetailTable],
    template: `
        <p>Image Details</p>
        <p>
            Sort By
            <button (click)="sortByName()" class="button">Name</button>
            <button (click)="sortBySize()" class="button">Size</button>
            <button (click)="sortByDate()" class="button">Date</button>
        </p>
        <image-detail-table [tableData]="imageList"></image-detail-table>
    `
})
@AppStoreSubscriber()
export class ImageDetailList implements IAppStoreSubscriber {

    public imageList: any[] = [];

    constructor(private appStore: AppStore) {
    }

    public onInitAppStoreSubscription(source: any): void {
        return source
            .subscribe((state: any) => {
                this.imageList = _.map(state.imageData.sorted, (v: any) => {
                    return state.imageData.list[v]
                })
            })
    }

    public sortByName() {
        this.appStore.dispatch(sortImages(ImageSortBy.name))
    }

    public sortBySize() {
        this.appStore.dispatch(sortImages(ImageSortBy.size))
    }

    public sortByDate() {
        this.appStore.dispatch(sortImages(ImageSortBy.date))
    }
}
