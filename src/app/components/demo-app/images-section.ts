
import {Component} from '@angular/core'
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated'
import {Http} from '@angular/http'
import {AppStore} from '../../services/app-store'
import {AppStoreSubscriber, IAppStoreSubscriber} from '../../decorators/app-store-subscriber'
import {imageDataRequest} from '../../actions/image-list-actions'
import {ListLayout} from './layouts/list-layout'
import {ListGroupLayout} from './layouts/list-group-layout'
import {ViewLayout} from './layouts/view-layout'
import {EditLayout} from './layouts/edit-layout'

@Component({
    selector: 'demo-app',
    directives: [RouterOutlet],
    template: `<router-outlet></router-outlet>`
})
@RouteConfig([
    {
        path: '/list',
        name: 'List',
        component: ListLayout,
        useAsDefault: true
    },
    {
        path: '/groups',
        name: 'Groups',
        component: ListGroupLayout
    },
    {
        path: '/view/:id',
        name: 'View',
        component: ViewLayout
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        component: EditLayout,
        data: {
            isEditRoute: true
        }
    }
])
@AppStoreSubscriber()
export class ImagesSection implements IAppStoreSubscriber {

    public state = {};

    constructor(
        private appStore: AppStore,
        private http: Http) {
    }

    public onInitAppStoreSubscription(source: any): void {
        return source
            .map((state: any) => ({
                isLoading: state.imageData.isLoading
            }))
            .subscribe((componentState: any) => {
                this.state = componentState
            })
    }

    public ngOnInit() {
        // simulate a long load time
        setTimeout(() => this.appStore.dispatch(imageDataRequest(this.http)), 2000)
    }
}
