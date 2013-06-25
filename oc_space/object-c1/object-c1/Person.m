//
//  Person.m
//  object-c1
//
//  Created by snandy on 13-6-8.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#import "Person.h"

@implementation Person

+ (void)log:(NSString *)str {
    NSLog(@"output: %@", str);
}

- (NSString *)getName {
    return name;
}

- (void)setName:(NSString *)newName {
    name = newName;
}


@end
