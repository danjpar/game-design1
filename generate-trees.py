import random
from PIL import Image

def generate_forests(total_forests):
    forest_num = 1
    while forest_num <= total_forests:
        width = 1100
        height = 1100
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
                if random.random() > 0.7 :
                    angle = round(random.random()*180)
                    image = image.rotate(angle, expand=True)
                    image = image.crop(image.getbbox())
                    image = image.resize((imgWidth,imgHeight))
                    alpha = image.split()[-1]
                    forest.paste(image, (x,y+round(random.random()*40)), mask=alpha)
                x += 10+round(random.random()*40)
            x = 0
            y += 10+round(random.random()*40)
    
        forest = forest.crop(forest.getbbox()).resize((width,height))
        forest.save("batch/trees"+str(forest_num)+".png")
        forest_num += 1
