const numericSelectField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a {{sentenceCase key}}" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                    <SelectItem value="0">This</SelectItem>
                    <SelectItem value="2">Is</SelectItem>
                    <SelectItem value="3">Generated</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
`;

const updateNumericSelectField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a {{sentenceCase key}}" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                    <SelectItem value="0">This</SelectItem>
                    <SelectItem value="2">Is</SelectItem>
                    <SelectItem value="3">Generated</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
`;

const tiptapField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => <HtmlTipTapItem field={field} />}
    />
`;

const imageUploadField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <UploadImageItem
                field={field}
                imagePrefix="{{key}}"
                label="{{sentenceCase key}}"
            />
        )}
    />
`;

const inputField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <FormControl>
                    <Input placeholder="Enter {{sentenceCase key}}" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
`;

const numberInputField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <FormControl>
                    <Input placeholder="Enter {{sentenceCase key}}" {...field}  onChange={(e) => field.onChange(Number(e.target.value))}/>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
`;

const selectBooleanField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === "true")}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a {{sentenceCase key}}" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
`;

const updateSelectBooleanField = `
    <FormField
        control={form.control}
        name="{{key}}"
        render={({ field }) => (
            <FormItem>
                <FormLabel>{{sentenceCase key}}</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value?.toString()}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a {{sentenceCase key}}" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
`;

export const registerFormPartials = (plop) => {
    plop.setPartial('numericSelectField', numericSelectField);
    plop.setPartial('updateNumericSelectField', updateNumericSelectField);
    plop.setPartial('tiptapField', tiptapField);
    plop.setPartial('imageUploadField', imageUploadField);
    plop.setPartial('inputField', inputField);
    plop.setPartial('numberInputField', numberInputField);
    plop.setPartial('selectBooleanField', selectBooleanField);
    plop.setPartial('updateSelectBooleanField', updateSelectBooleanField);
}