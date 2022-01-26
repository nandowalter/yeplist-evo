import { trigger, transition, style, animate, query, stagger, animateChild, group } from '@angular/animations';

export const secondaryPageAnimations = trigger('secondaryPage', [
    transition('false => true', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            stagger(30, [
              animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
            ])
        ])
    ]),
    transition('true => false', [
        query(':leave', [
            style({ opacity: 1, transform: 'none' }),
            stagger(30, [
              animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateX(100%)' }))
            ])
        ])
    ])
]);

// nice stagger effect when showing existing elements
export const listAnimations = trigger('list', [
    transition(':enter', [
        // child animation selector + stagger
        query('@items', 
            stagger(300, animateChild()),
            { optional: true }
        )
    ]),
]);

export const listItemsAnimations = trigger('items', [
    // cubic-bezier for a tiny bouncing feel
    transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)', style({ transform: 'scale(1)', opacity: 1 }))
    ]),
    transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)', style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
    ]),      
])