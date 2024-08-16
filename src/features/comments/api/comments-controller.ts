import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments-service';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
import { CommentInputDto } from './dto/input/comment-input-dto';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { CommentViewDto } from './dto/output/comment-view-dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':cardId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create comment for card' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the newly created comment',
        type: CommentViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: "If card doesn't exists",
    })
    async createComment(
        @Param('cardId') cardId: string,
        @Body() commentInputDto: CommentInputDto,
        @CurrentUserId() userId: string,
    ) {
        const commentInterLayer = await this.commentsService.createComment(
            commentInputDto,
            userId,
            cardId,
        );

        if (commentInterLayer.hasError()) {
            throw new NotFoundException();
        }

        return commentInterLayer.data;
    }
}
