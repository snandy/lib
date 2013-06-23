//
//  Person.h
//  object-c1
//
//  Created by snandy on 13-6-8.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Person : NSObject {
    NSString *name;
    int age;
}

+ (void)log:(NSString *)str;

- (NSString *)getName;

- (void)setName:(NSString *)newName;


@end
