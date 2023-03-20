import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  Directive,
  EventEmitter,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

export type ImageObjectFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

@Directive({
  selector: '[lazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit, OnDestroy {
  @Output() onLazyLoad: EventEmitter<any> = new EventEmitter();

  private intersectionObserver?: IntersectionObserver;

  constructor(
    private elemRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      this.observeHandler(entries);
    });

    this.intersectionObserver.observe(this.elemRef.nativeElement);
  }

  observeHandler(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.isElementInViewPort(entry)) {
        this.onLazyLoad.emit()

        this.cancelObserve();
      }
    })
  }

  isElementInViewPort(entry: IntersectionObserverEntry) {
    return entry.isIntersecting && entry.target === this.elemRef.nativeElement;
  }

  cancelObserve() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.elemRef.nativeElement);
      this.intersectionObserver.disconnect();
    }
  }

  ngOnDestroy(): void {
    this.cancelObserve();
  }
}


@Component({
  selector: 'ux-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnInit {

  @Input() src: string = 'https://picsum.photos/200/200';
  @Input() width: string | number = 200;
  @Input() height: string | number = 200;
  @Input() alt: string = "";
  @Input() objectFit: ImageObjectFitType = 'contain';
  @Input() radius: number = 0;
  @Input() customStyle: Record<string, any> = {};
  @ViewChild("imgRef") imgRef: ElementRef | undefined;

  public isShow = false;
  public isInViewPort = false;

  constructor() { }

  ngOnInit(): void {
  }

  handleLazyLoad() {
    this.isInViewPort = true;

    const loadHandler = () => {
      this.isShow = true;
      this.imgRef.nativeElement.removeEventListener("load", loadHandler);
    }

    setTimeout(() => {
      this.imgRef.nativeElement.addEventListener("load", loadHandler);
    })
  }

  imgStyle() {
    let width = this.formatValue(this.width);
    let height = this.formatValue(this.height);
    let objectFit = this.objectFit;
    let radius = this.radius;

    return {
      width,
      height,
      "border-radius": radius,
      "object-fit": objectFit,
      ...this.customStyle
    }
  }

  // ==== utils ====
  formatValue(value: string | number) {
    if (typeof value === "string") {
      let isAllNumber = /^\d+$/;

      return isAllNumber ? (value + 'px') : value;
    } else {
      return value + "px"
    }
  }
}
