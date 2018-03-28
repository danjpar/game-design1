import random
from PIL import Image

def generate_forest():
    # image.transpose(Image.FLIP_LEFT_RIGHT)
    width = 550
    height = 550
    forest = Image.new(mode='RGBA', size=(width, height), color=(0,0,0,0))
    imgWidth = 100
    imgHeight = 100
    maxX = width-imgWidth
    maxY = height-imgHeight-40
    x = 0
    y = 0
    while y < maxY:
        while x < maxX:
            if random.random() > 0.5 :
                input_fn = "batch/tree1.png"
            else :
                input_fn = "batch/tree2.png"
            image = Image.open(input_fn).convert('RGBA')
            image = image.resize((imgWidth,imgHeight))
            if random.random() > 0.5 :
                image = image.transpose(Image.FLIP_LEFT_RIGHT)
            if random.random() > 0.78 :
                angle = round(random.random()*180)
                image2 = image.rotate(angle, expand=True)
                image2 = image2.crop(image2.getbbox())
                image2 = image2.resize((imgWidth,imgHeight))
                alpha = image2.split()[-1]
                forest.paste(image2, (x,y+round(random.random()*40)), mask=alpha)
            x += 10+round(random.random()*40)
        x = 0
        y += 10+round(random.random()*40)

    return forest.crop(forest.getbbox()).resize((width,height)) #.save(output_fn)   , "batch/treesss1.png"

def generate_forests(total_forests):
    forest_num = 1
    while forest_num <= total_forests:
        x = 0
        y = 0
        forest_size = 4
        num=1
        forests = Image.new(mode='RGBA', size=(1100, 1100), color=(0,0,0,0))
        while num <= forest_size:
            forest = generate_forest()
            alpha = forest.split()[-1]
            forests.paste(forest, (x,y), mask=alpha)
            x+=450
            if num == 2:
                y+=450
                x=0
            num+=1
        forests = forests.crop(forests.getbbox()).resize((1000,1000))
        forests.save("batch/trees"+str(forest_num)+".png")
        forest_num+=1
