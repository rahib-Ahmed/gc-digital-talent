<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Execution\Arguments\Argument;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgResolver;

final class ResolveWithDirective extends BaseDirective implements ArgDirective, ArgResolver
{
    // TODO implement the directive https://lighthouse-php.com/master/custom-directives/getting-started.html

    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Process an input field by passing it to a specific method.
Note that if your input field contains an array, it will be passed to the method as a single argument.
"""
directive @resolveWith(
    """
    The method name.
    """
    method: String!
    """
    By default, this will call a method on the root object. If class is specified, it will look for a static method on that class.
    """
    class: String
) on INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * $value can be a scalar, an array of scalars, an ArgumentSet, or an array of argument sets.
     * ArgumentSets represent nested input types.
     * This function will leave scalars and arrays of scalars alone, and convert ArgumetnSets into named php arrays.
     *
     * @param  mixed|\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet|array<\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet>  $value  The slice of arguments that belongs to this nested resolver.
     * @return void
     */
    public function toPlainValue($value)
    {
        $arg = new Argument();
        $arg->value = $value;
        return $arg->toPlain();
    }

    /**
     * @param  mixed  $root  The result of the parent resolver.
     * @param  mixed|\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet|array<\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet>  $value  The slice of arguments that belongs to this nested resolver.
     * @return mixed
     */
    public function __invoke($root, $value)
    {
        $plainValue = $this->toPlainValue($value);
        $method = $this->directiveArgValue('method');
        if ($this->directiveHasArgument('class')) {
            $class = $this->directiveArgValue('class');
            return $class::$method($plainValue);
        } else {
            return $root->$method($plainValue);
        }
    }
}
