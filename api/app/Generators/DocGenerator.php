<?php

namespace App\Generators;

use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\Element;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

abstract class DocGenerator
{
    protected PhpWord $doc;

    protected array $strong;

    public function __construct()
    {
        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 12, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);

        $this->strong = ['bold' => true];
    }

    abstract public function generate();

    public function write(string $fileName)
    {
        /** @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk('user_generated');

        $path = $disk->path($fileName);

        $writer = IOFactory::createWriter($this->doc);

        return $writer->save($path);
    }

    protected function addLabelText(Element\Section $section, string $label, string $text)
    {
        $run = $section->addTextRun();
        $run->addText($label.': ', $this->strong);
        $run->addText($text);
    }

    protected function sanitizeEnum(string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }
}
