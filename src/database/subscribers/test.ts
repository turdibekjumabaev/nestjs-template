import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';

@EventSubscriber()
export class test implements EntitySubscriberInterface {}
