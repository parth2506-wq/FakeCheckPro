import os
import re

directories = ['src/pages', 'src/components']
bg_pattern = re.compile(r'bg-white/(30|40|50|60|80)')
border_pattern = re.compile(r'border-(brand-gray/20|brand-gray/10|white/40|white/80|white)')

for directory in directories:
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace bg-white/XX with bg-white/XX dark:bg-white/90
                new_content = bg_pattern.sub(lambda m: f'{m.group(0)} dark:bg-white/90', content)
                
                # Replace border-XXX with border-XXX dark:border-white/60
                new_content = border_pattern.sub(lambda m: f'{m.group(0)} dark:border-white/60', new_content)
                
                # Specific fix for text-brand-gray to ensure it's visible on white/90 in dark mode
                # Actually, brand-gray (#717A8C) is visible enough on white.
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Updated {filepath}')
